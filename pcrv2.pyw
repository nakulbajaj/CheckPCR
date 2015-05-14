#! /usr/bin/python
import urllib, json, sys
if sys.version_info[0] < 3:
    from urllib2 import build_opener, install_opener, HTTPRedirectHandler, HTTPCookieProcessor, urlopen, Request
    from cookielib import CookieJar
    from BaseHTTPServer import HTTPServer
    from SocketServer import ThreadingMixIn
    from SimpleHTTPServer import SimpleHTTPRequestHandler
    from thread import start_new_thread
    from HTMLParser import HTMLParser
    from urllib import urlencode
else:
    from urllib.request import build_opener, install_opener, HTTPRedirectHandler, HTTPCookieProcessor, urlopen, Request
    from http.cookiejar import CookieJar
    from http.server import HTTPServer, SimpleHTTPRequestHandler
    from socketserver import ThreadingMixIn
    from _thread import start_new_thread
    from html.parser import HTMLParser
    from urllib.parse import urlencode
import os, fnmatch, subprocess, threading, sys
import zlib

if '__file__' in locals():
    os.chdir(os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__))))

toLoginData = dict()
toLoginDataOther = dict()
loginUrl = ""

cj = CookieJar()
opener = build_opener(HTTPRedirectHandler, HTTPCookieProcessor(cj))
install_opener(opener)

x = None

assignments = list()

def b(s):
    if sys.version_info[0] < 3:
        return s
    else:
        return bytes(s, 'utf-8')
def fb(b):
    if sys.version_info[0] < 3:
        return b
    else:
        return b.decode('utf-8')

def getUrl(url, data=None):
    #return urlopem(url, data=data)
    response = urlopen(Request(url, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-encoding': 'gzip, deflate'}, data=data))
    if response.info().get('Content-Encoding') == 'gzip':
        return (response, fb(zlib.decompress(response.read(), 16+zlib.MAX_WBITS)))
    return (response, fb(response.read()))

def s(req, data):
    print(req.path)
    req.request.sendall(b(data))

class ThreadingServer(ThreadingMixIn, HTTPServer):
    pass

#Parse input tags
class InputParser(HTMLParser):
    def handle_starttag(self, tag, attrs):
        if tag == "input":
            name = ""
            value = ""
            for t in attrs:
                if t[0] == "name":
                    name = t[1]
                elif t[0] == "value":
                    value = t[1]
            if name != "":
                if "user" in name.lower() or "pass" in name.lower():
                    toLoginData[name] = value
                else:
                    toLoginDataOther[name] = value
#Parse assignments
class AssignmentParser(HTMLParser):
    def handle_starttag(self, tag, attrs):
        if tag == "input":
            name = ""
            value = ""
            for t in attrs:
                if t[0] == "name":
                    name = t[1]
                elif t[0] == "value":
                    value = t[1]
            if name != "":
                toLoginDataOther[name] = value
def q(tray=None):
    os._exit(1)
class RequestHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        global loginUrl, assignments
        if self.path == '/' or self.path == '/list':
            self.path = main
        elif self.path == '/commit':
            try:
                with open('commit.txt', 'r') as f:
                    r = f.read()
                    s(self, "!" if len(r) == 0 else r)
            except IOError:
                s(self, "!")
            return
        elif self.path == '/setcommit':
            with open('commit.txt', 'w') as f:
                f.write(self.headers.get("commit"))
            s(self, self.headers.get("commit"))
            return
        elif self.path == '/start':
            url = 'https://webappsca.pcrsoft.com/Clue/Student-Assignments-End-Date-Range/7536'
            try:
                (r, read) = getUrl(url)
                if 'Login' in r.url:
                    s(self, "Login")
                    loginUrl = r.url
                    parser = InputParser()
                    parser.feed(read)
                else:
                    ap = AssignmentParser()
                    ap.feed(read)
                    s(self, read)
            except Exception as e:
                print(e)
                s(self, "Load")
            return
        elif self.path == '/login':
            for x in toLoginData:
                if "user" in x.lower():
                    toLoginData[x]=self.headers.get("user")
                elif "pass" in x.lower():
                    toLoginData[x] = self.headers.get("pass")
            toLoginDataOther.update(toLoginData)
            (r, read) = getUrl(loginUrl, data=b(urlencode(toLoginDataOther)))
            if r.url == loginUrl:
                s(self, "Login")
            else:
                ap = AssignmentParser()
                ap.feed(read)
                s(self, read)
            return
        elif self.path.startswith('/attachment'):
            r = urlopen(Request('https://webappsca.pcrsoft.com/Clue/Common/AttachmentRender.aspx'+self.path[11:], headers=self.headers))
            self.send_response(r.getcode())
            i = r.info()
            for h in i:
                self.send_header(h, i[h])
            self.end_headers()
            self.wfile.write(r.read())
        elif self.path == '/quit':
            s(self, "Going to quit in 1 second");
            t = threading.Timer(1, q)
            t.start()
            return
        return SimpleHTTPRequestHandler.do_GET(self)

main = "index.html"

PORT = 9000
def createTaskbarIcon():
    def at():
        try:
            import applicationTray
            hover_text = "PCR viewer"
            def launchApp(sysTrayIcon): launchWindow()
            menu_options = (('Launch app', None, launchApp), ('Also lauch app', None, launchApp))
            applicationTray.SysTrayIcon("favicon.ico", hover_text, menu_options, on_quit=q)
        except ImportError:
            pass

    start_new_thread(at, ())


def launchWindow():
    if os.name == 'nt':
        subprocess.call('start chrome --chrome-frame --app="http://localhost:9000"', shell=True)
    else:
        subprocess.call('open -a "Google Chrome" --args --app="http://localhost:9000"', shell=True)

t = threading.Timer(0.5, launchWindow)
t.start()
try:
    httpd = ThreadingServer(("localhost", PORT), RequestHandler)
    createTaskbarIcon()
    httpd.serve_forever()
except:
    pass #already running
