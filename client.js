var a, aa, ab, ac, act, activity, activityTypes, addActivity, ae, af, athenaData, attachmentify, c, cc, checkCommit, closeNews, closeOpened, color, d, dateString, display, dologin, done, dragTarget, dt, e, el, element, enabled, fetch, findId, firstTime, fn, fn1, formatUpdate, fullMonths, getCookie, getResizeAssignments, gp, hammertime, headroom, hex2rgb, input, intervalRefresh, j, k, l, labrgb, lastAthena, lc, len, len1, len2, len3, len4, len5, len6, len7, len8, len9, list, listName, loginHeaders, loginURL, menuOut, mimeTypes, months, navToggle, o, p, palette, parse, parseDateHash, pe, q, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, resize, rgb2hex, ripple, scroll, send, separate, setCookie, smoothScroll, snackbar, sp, tab, type, tzoff, u, up, upc, updateAvatar, updateColors, updateSelectNum, urlify, viewData, weekdays, z,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

if (window.location.protocol === "http:" && location.hostname !== "localhost") {
  window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);
}

loginURL = "";

loginHeaders = {};

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

tzoff = (new Date()).getTimezoneOffset() * 1000 * 60;

mimeTypes = {
  "application/msword": ["Word Doc", "document"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ["Word Doc", "document"],
  "application/vnd.ms-powerpoint": ["PPT Presentation", "slides"],
  "application/pdf": ["PDF File", "pdf"],
  "text/plain": ["Text Doc", "plain"]
};

scroll = 0;

viewData = {};

activity = [];

send = function(url, respType, headers, data, progress) {
  if (progress == null) {
    progress = false;
  }
  return new Promise(function(resolve, reject) {
    var header, headername, load, progressElement, progressInner, req;
    req = new XMLHttpRequest();
    req.open((data != null ? "POST" : "GET"), url, true);
    progressElement = document.getElementById("progress");
    progressInner = progressElement.querySelector("div");
    if (progress) {
      progressElement.offsetWidth;
      progressElement.classList.add("active");
      if (progressInner.classList.contains("determinate")) {
        progressInner.classList.remove("determinate");
        progressInner.classList.add("indeterminate");
      }
    }
    load = localStorage["load"] || 170000;
    req.onload = function(evt) {
      localStorage["load"] = evt.loaded;
      if (progress) {
        progressElement.classList.remove("active");
      }
      if (req.status === 200) {
        resolve(req);
      } else {
        reject(Error(req.statusText));
      }
    };
    req.onerror = function() {
      if (progress) {
        progressElement.classList.remove("active");
      }
      reject(Error("Network Error"));
    };
    if (progress) {
      req.onprogress = function(evt) {
        if (progressInner.classList.contains("indeterminate")) {
          progressInner.classList.remove("indeterminate");
          progressInner.classList.add("determinate");
        }
        return progressInner.style.width = 100 * evt.loaded / (evt.lengthComputable ? evt.total : load) + "%";
      };
    }
    if (respType != null) {
      req.responseType = respType;
    }
    if (headers != null) {
      for (headername in headers) {
        header = headers[headername];
        req.setRequestHeader(headername, header);
      }
    }
    if (data != null) {
      req.send(data);
    } else {
      req.send();
    }
  });
};

getCookie = function(cname) {
  var c, ca, i, name;
  name = cname + "=";
  ca = document.cookie.split(";");
  i = 0;
  while (i < ca.length) {
    c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) !== -1) {
      return c.substring(name.length, c.length);
    }
    i++;
  }
  return "";
};

setCookie = function(cname, cvalue, exdays) {
  var d, expires;
  d = new Date;
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
};

snackbar = function(message, action, f) {
  var actionE, add, existing, snack, snackInner;
  snack = element("div", "snackbar");
  snackInner = element("div", "snackInner", message);
  snack.appendChild(snackInner);
  if ((action != null) && (f != null)) {
    actionE = element("a", [], action);
    actionE.addEventListener("click", function() {
      snack.classList.remove("active");
      return f();
    });
    snackInner.appendChild(actionE);
  }
  add = function() {
    document.body.appendChild(snack);
    snack.offsetHeight;
    snack.classList.add("active");
    return setTimeout(function() {
      snack.classList.remove("active");
      return setTimeout(function() {
        return snack.remove();
      }, 900);
    }, 5000);
  };
  existing = document.querySelector(".snackbar");
  if (existing != null) {
    existing.classList.remove("active");
    setTimeout(add, 300);
  } else {
    add();
  }
};

formatUpdate = function(date) {
  var ampm, daysPast, hr, min, now, update;
  now = new Date();
  update = new Date(+date);
  if (now.getDate() === update.getDate()) {
    ampm = "AM";
    hr = update.getHours();
    if (hr > 12) {
      ampm = "PM";
      hr -= 12;
    }
    min = update.getMinutes();
    return "Today at " + hr + ":" + (min < 10 ? "0" + min : min) + " " + ampm;
  } else {
    daysPast = Math.ceil((now.getTime() - update.getTime()) / 1000 / 3600 / 24);
    if (daysPast === 1) {
      return "Yesterday";
    } else {
      return daysPast + " days ago";
    }
  }
};

fetch = function() {
  if (location.protocol === "chrome-extension:") {
    console.time("Fetching assignments");
    send("https://webappsca.pcrsoft.com/Clue/Student-Assignments-End-Date-Range/7536", "document", null, null, true).then(function(resp) {
      var e, error1, j, len, ref, t, up;
      console.timeEnd("Fetching assignments");
      if (resp.responseURL.indexOf("Login") !== -1) {
        loginURL = resp.responseURL;
        ref = resp.response.getElementsByTagName("input");
        for (j = 0, len = ref.length; j < len; j++) {
          e = ref[j];
          loginHeaders[e.name] = e.value || "";
        }
        console.log("Need to log in");
        up = getCookie("userPass");
        if (up === "") {
          document.getElementById("loginBackground").style.display = "block";
          document.getElementById("login").classList.add("active");
        } else {
          dologin(window.atob(up).split(":"));
        }
      } else {
        console.log("Fetching assignments successful");
        t = Date.now();
        localStorage["lastUpdate"] = t;
        document.getElementById("lastUpdate").innerHTML = formatUpdate(t);
        try {
          parse(resp.response);
        } catch (error1) {
          e = error1;
          console.log(e);
          alert("Error parsing assignments. Is PCR on list or month view?");
        }
      }
    }, function(error) {
      console.log("Could not fetch assignments; You are probably offline. Here's the error:", error);
      snackbar("Could not fetch your assignments", "Retry", fetch);
    });
  } else {
    send("/api/start", "json", null, null, true).then(function(resp) {
      var t;
      console.debug("Fetching assignments:", resp.response.time);
      if (resp.response.login) {
        loginHeaders = resp.response.loginHeaders;
        document.getElementById("loginBackground").style.display = "block";
        document.getElementById("login").classList.add("active");
      } else {
        console.log("Fetching assignments successful");
        t = Date.now();
        localStorage["lastUpdate"] = t;
        document.getElementById("lastUpdate").innerHTML = formatUpdate(t);
        window.data = resp.response.data;
        display();
        localStorage["data"] = JSON.stringify(data);
      }
    }, function(error) {
      console.log("Could not fetch assignments; You are probably offline. Here's the error:", error);
      return snackbar("Could not fetch your assignments", "Retry", fetch);
    });
  }
};

dologin = function(val, submitEvt) {
  var h, postArray;
  if (submitEvt == null) {
    submitEvt = false;
  }
  document.getElementById("login").classList.remove("active");
  setTimeout(function() {
    return document.getElementById("loginBackground").style.display = "none";
  }, 350);
  postArray = [];
  localStorage["username"] = (val != null) && !submitEvt ? val[0] : document.getElementById("username").value;
  updateAvatar();
  for (h in loginHeaders) {
    if (h.toLowerCase().indexOf("user") !== -1) {
      loginHeaders[h] = (val != null) && !submitEvt ? val[0] : document.getElementById("username").value;
    }
    if (h.toLowerCase().indexOf("pass") !== -1) {
      loginHeaders[h] = (val != null) && !submitEvt ? val[1] : document.getElementById("password").value;
    }
    postArray.push(encodeURIComponent(h) + "=" + encodeURIComponent(loginHeaders[h]));
  }
  if (location.protocol === "chrome-extension:") {
    console.time("Logging in");
    send(loginURL, "document", {
      "Content-type": "application/x-www-form-urlencoded"
    }, postArray.join("&"), true).then(function(resp) {
      var e, error1, t;
      console.timeEnd("Logging in");
      if (resp.responseURL.indexOf("Login") !== -1) {
        document.getElementById("loginIncorrect").style.display = "block";
        document.getElementById("password").value = "";
        document.getElementById("login").classList.add("active");
        return document.getElementById("loginBackground").style.display = "block";
      } else {
        if (document.getElementById("remember").checked) {
          setCookie("userPass", window.btoa(document.getElementById("username").value + ":" + document.getElementById("password").value), 14);
        }
        t = Date.now();
        localStorage["lastUpdate"] = t;
        document.getElementById("lastUpdate").innerHTML = formatUpdate(t);
        try {
          parse(resp.response);
        } catch (error1) {
          e = error1;
          console.log(e);
          alert("Error parsing assignments. Is PCR on list or month view?");
        }
      }
    }, function(error) {
      return console.log("Could not log in to PCR. Either your network connection was lost during your visit or PCR is just not working. Here's the error:", error);
    });
  } else {
    console.log(postArray);
    send("/api/login?remember=" + (document.getElementById("remember").checked), "json", {
      "Content-type": "application/x-www-form-urlencoded"
    }, postArray.join("&"), true).then(function(resp) {
      var t;
      console.debug("Logging in:", resp.response.time);
      if (resp.response.login) {
        document.getElementById("loginIncorrect").style.display = "block";
        document.getElementById("password").value = "";
        document.getElementById("login").classList.add("active");
        document.getElementById("loginBackground").style.display = "block";
      } else {
        t = Date.now();
        localStorage["lastUpdate"] = t;
        document.getElementById("lastUpdate").innerHTML = formatUpdate(t);
        window.data = resp.response.data;
        display();
        localStorage["data"] = JSON.stringify(data);
      }
    }, function(error) {
      return console.log("Could not log in to PCR. Either your network connection was lost during your visit or PCR is just not working. Here's the error:", error);
    });
  }
};

document.getElementById("login").addEventListener("submit", function(evt) {
  evt.preventDefault();
  return dologin(null, true);
});

parseDateHash = function(element) {
  var dateSplit;
  dateSplit = element.hash.substring(1).split("-");
  return (new Date(+dateSplit[0], +dateSplit[1] - 1, +dateSplit[2])).getTime();
};

attachmentify = function(element) {
  var a, as, attachments;
  attachments = [];
  as = element.getElementsByTagName('a');
  a = 0;
  while (a < as.length) {
    if (as[a].id.indexOf('Attachment') !== -1) {
      attachments.push([as[a].innerHTML, as[a].search + as[a].hash]);
      as[a].remove();
      a--;
    }
    a++;
  }
  return attachments;
};

urlify = function(text) {
  return text.replace(/(https?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]+)/ig, function(str, str2, offset) {
    if (/href\s*=\s*./.test(text.substring(offset - 10, offset))) {
      return str;
    } else {
      return '<a href="' + str + '">' + str + '</a>';
    }
  });
};

findId = function(element, tag, id) {
  var e, j, len, ref;
  ref = element.getElementsByTagName(tag);
  for (j = 0, len = ref.length; j < len; j++) {
    e = ref[j];
    if (e.id.indexOf(id) !== -1) {
      return e;
    }
  }
};

parse = function(doc) {
  var ap, assignment, assignments, b, c, ca, classes, d, divs, e, handledDataShort, j, k, l, len, len1, len2, len3, o, pos, q, range, ref, ref1, t, title;
  console.time("Handling data");
  handledDataShort = [];
  window.data = {
    classes: [],
    assignments: [],
    monthView: doc.querySelector(".rsHeaderMonth").parentNode.classList.contains("rsSelected")
  };
  ref = doc.getElementsByTagName("input");
  for (j = 0, len = ref.length; j < len; j++) {
    e = ref[j];
    viewData[e.name] = e.value || "";
  }
  classes = findId(doc, "table", "cbClasses").getElementsByTagName("label");
  for (k = 0, len1 = classes.length; k < len1; k++) {
    c = classes[k];
    window.data.classes.push(c.innerHTML);
  }
  assignments = doc.getElementsByClassName("rsApt rsAptSimple");
  for (l = 0, len2 = assignments.length; l < len2; l++) {
    ca = assignments[l];
    assignment = {};
    range = findId(ca, "span", "StartingOn").innerHTML.split(" - ");
    assignment.start = Math.floor((Date.parse(range[0])) / 1000 / 3600 / 24);
    assignment.end = range[1] != null ? Math.floor((Date.parse(range[1])) / 1000 / 3600 / 24) : assignment.start;
    t = findId(ca, "span", "lblTitle");
    title = t.innerHTML;
    b = t.parentNode.parentNode;
    divs = b.getElementsByTagName("div");
    for (d = o = 0; o < 2; d = ++o) {
      divs[0].remove();
    }
    ap = attachmentify(b);
    assignment.attachments = ap;
    assignment.body = urlify(b.innerHTML).replace(/^(?:\s*<br\s*\/?>)*/, "").replace(/(?:\s*<br\s*\/?>)*\s*$/, "").trim();
    assignment.type = title.match(/\(([^\(\)]*)\)$/)[1].toLowerCase().replace("& quizzes", "").replace("tests", "test");
    assignment.baseType = (ca.title.substring(0, ca.title.indexOf("\n"))).toLowerCase().replace("& quizzes", "");
    ref1 = window.data.classes;
    for (pos = q = 0, len3 = ref1.length; q < len3; pos = ++q) {
      c = ref1[pos];
      if (title.indexOf(c) !== -1) {
        assignment["class"] = pos;
        title = title.replace(c, "");
        break;
      }
    }
    assignment.title = title.substring(title.indexOf(": ") + 2).replace(/\([^\(\)]*\)$/, "").trim();
    assignment.id = assignment.title.replace(/[^\w]*/g, "") + (assignment.start + assignment.end);
    if (handledDataShort.indexOf(assignment.id) === -1) {
      handledDataShort.push(assignment.id);
      window.data.assignments.push(assignment);
    }
  }
  console.timeEnd("Handling data");
  document.body.classList.add("loaded");
  display();
  localStorage["data"] = JSON.stringify(data);
};


/*document.getElementById("switchViews").addEventListener "click", ->
  if Object.keys(viewData).length > 0
    viewData["__EVENTTARGET"] = "ctl00$ctl00$baseContent$baseContent$flashTop$ctl00$RadScheduler1"
    viewData["__EVENTARGUMENT"] = JSON.stringify {Command: "SwitchTo#{if document.body.getAttribute("data-pcrview") is "month" then "Week" else "Month"}View"}
    viewData["ctl00_ctl00_baseContent_baseContent_flashTop_ctl00_RadScheduler1_ClientState"] = JSON.stringify {scrollTop:0,scrollLeft:0,isDirty:false}
    viewData["ctl00_ctl00_RadScriptManager1_TSM"] = ";;AjaxControlToolkit, Version=4.1.40412.0, Culture=neutral, PublicKeyToken=28f01b0e84b6d53e:en-US:acfc7575-cdee-46af-964f-5d85d9cdcf92:ea597d4b:b25378d2"
    postArray = [] # Array of data to post
    for h,v of viewData
      postArray.push encodeURIComponent(h) + "=" + encodeURIComponent(v)
    send "https://webappsca.pcrsoft.com/Clue/Student-Assignments-End-Date-Range/7536", "document", { "Content-type": "application/x-www-form-urlencoded" }, postArray.join("&"), true
      .then (resp) ->
        try
          parse resp.response # Parse the data PCR has replied with
        catch e
          console.log e
          alert "Error parsing assignments. Is PCR on list or month view?"
        return
      , (error) ->
        console.log "Could not switch views. Either your network connection was lost during your visit or PCR is just not working. Here's the error:", error
 */

element = function(tag, cls, html, id) {
  var c, e, j, len;
  e = document.createElement(tag);
  if (typeof cls === "string") {
    e.classList.add(cls);
  } else {
    for (j = 0, len = cls.length; j < len; j++) {
      c = cls[j];
      e.classList.add(c);
    }
  }
  if (html != null) {
    e.innerHTML = html;
  }
  if (id != null) {
    e.setAttribute("id", id);
  }
  return e;
};

dateString = function(date, addThis) {
  var j, len, r, ref, relative, today;
  if (addThis == null) {
    addThis = false;
  }
  relative = ["Tomorrow", "Today", "Yesterday", "2 days ago"];
  today = new Date();
  today.setDate(today.getDate() + 1);
  for (j = 0, len = relative.length; j < len; j++) {
    r = relative[j];
    if (date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
      return r;
    }
    today.setDate(today.getDate() - 1);
  }
  today = new Date();
  if ((0 < (ref = (date.getTime() - today.getTime()) / 1000 / 3600 / 24) && ref <= 6)) {
    return (addThis ? "This " : "") + weekdays[date.getDay()];
  }
  return weekdays[date.getDay()] + ", " + fullMonths[date.getMonth()] + " " + (date.getDate());
};

separate = function(cl) {
  return cl.match(/((?:\d*\s+)?(?:(?:hon\w*|(?:adv\w*\s*)?core)\s+)?)(.*)/i);
};

smoothScroll = function(to) {
  return new Promise(function(resolve, reject) {
    var amount, from, start, step;
    start = null;
    from = document.body.scrollTop;
    amount = to - from;
    step = function(timestamp) {
      var progress;
      if (start == null) {
        start = timestamp;
      }
      progress = timestamp - start;
      window.scrollTo(0, from + amount * (progress / 350));
      if (progress < 350) {
        return requestAnimationFrame(step);
      } else {
        setTimeout(function() {
          return document.querySelector("nav").classList.remove("headroom--unpinned");
        }, 1);
        return setTimeout(function() {
          return resolve();
        }, amount);
      }
    };
    return requestAnimationFrame(step);
  });
};

addActivity = function(type, assignment, newActivity) {
  var date, id, ref, te;
  date = newActivity === true ? Date.now() : newActivity;
  if (newActivity === true) {
    activity.push([type, assignment, Date.now()]);
  }
  te = element("div", ["activity", "assignmentItem", assignment.baseType, type], "<i class='material-icons'>" + type + "</i><span class='title'>" + assignment.title + "</span><small>" + (separate(window.data.classes[assignment["class"]])[2]) + "</small><div class='range'>" + (dateString(new Date(date))) + "</div>", "activity" + assignment.id);
  te.setAttribute("data-class", window.data.classes[assignment["class"]]);
  id = assignment.id;
  if (type !== "delete") {
    (function(id) {
      return te.addEventListener("click", function() {
        var doScrolling;
        doScrolling = function() {
          var el;
          el = document.querySelector(".assignment[id*=\"" + id + "\"]");
          return smoothScroll(el.getBoundingClientRect().top + document.body.scrollTop - 116).then(function() {
            el.click();
          });
        };
        if (document.body.getAttribute("data-view") === "0") {
          return doScrolling();
        } else {
          document.querySelector("#navTabs>li:first-child").click();
          return setTimeout(doScrolling, 500);
        }
      });
    })(id);
  }
  if (ref = assignment.id, indexOf.call(done, ref) >= 0) {
    te.classList.add("done");
  }
  return document.getElementById("infoActivity").insertBefore(te, document.getElementById("infoActivity").querySelector(".activity"));
};

display = function() {
  var aa, already, assignment, attachment, attachments, close, complete, d, date, day, dayTable, e, end, fn, fn1, found, h, id, j, k, l, lastAssignments, len, len1, len2, len3, len4, len5, len6, link, main, month, n, name, nextSat, num, o, oldAssignment, pos, previousAssignments, q, ref, ref1, ref2, ref3, ref4, ref5, s, separated, smallTag, span, spanRelative, split, start, startSun, sw, taken, tdst, te, times, today, todaySE, todayWk, todayWkId, tr, u, val, weekHeights, weekId, wk, wkId, year, z;
  console.time("Displaying data");
  document.body.setAttribute("data-pcrview", window.data.monthView ? "month" : "other");
  main = document.querySelector("main");
  taken = {};
  today = Math.floor((Date.now() - tzoff) / 1000 / 3600 / 24);
  if (window.data.monthView) {
    start = Math.min.apply(Math, (function() {
      var j, len, ref, results;
      ref = window.data.assignments;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        assignment = ref[j];
        results.push(assignment.start);
      }
      return results;
    })());
    end = Math.max.apply(Math, (function() {
      var j, len, ref, results;
      ref = window.data.assignments;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        assignment = ref[j];
        results.push(assignment.end);
      }
      return results;
    })());
    year = (new Date()).getFullYear();
    month = 0;
    ref = window.data.assignments;
    for (j = 0, len = ref.length; j < len; j++) {
      assignment = ref[j];
      month += (new Date((assignment.start + assignment.end) * 500 * 3600 * 24)).getMonth();
    }
    month = Math.round(month / window.data.assignments.length);
    start = new Date(Math.max(start * 1000 * 3600 * 24 + tzoff, (new Date(year, month)).getTime()));
    end = new Date(Math.min(end * 1000 * 3600 * 24 + tzoff, (new Date(year, month + 1, 0)).getTime()));
  } else {
    todaySE = new Date();
    start = new Date(todaySE.getFullYear(), todaySE.getMonth(), todaySE.getDate());
    end = new Date(todaySE.getFullYear(), todaySE.getMonth(), todaySE.getDate());
  }
  start.setDate(start.getDate() - start.getDay());
  end.setDate(end.getDate() + (6 - end.getDay()));
  d = new Date(start);
  wk = null;
  lastAssignments = localStorage["data"] ? JSON.parse(localStorage["data"]).assignments : null;
  while (d <= end) {
    if (d.getDay() === 0) {
      id = "wk" + (d.getMonth()) + "-" + (d.getDate());
      if ((document.getElementById(id)) == null) {
        wk = element("section", "week", null, "wk" + (d.getMonth()) + "-" + (d.getDate()));
        dayTable = element("table", "dayTable");
        tr = dayTable.insertRow();
        for (day = k = 0; k < 7; day = ++k) {
          tr.insertCell();
        }
        wk.appendChild(dayTable);
        main.appendChild(wk);
      } else {
        wk = document.getElementById(id);
      }
    }
    if (wk.getElementsByClassName("day").length <= d.getDay()) {
      day = element("div", "day", null, "day");
      if (Math.floor((d - tzoff) / 1000 / 3600 / 24) === today) {
        day.classList.add("today");
      }
      month = element("span", "month", months[d.getMonth()]);
      day.appendChild(month);
      date = element("span", "date", d.getDate());
      day.appendChild(date);
      wk.appendChild(day);
    }
    taken[d] = [];
    d.setDate(d.getDate() + 1);
  }
  split = [];
  ref1 = window.data.assignments;
  for (num = l = 0, len1 = ref1.length; l < len1; num = ++l) {
    assignment = ref1[num];
    s = Math.max(start.getTime(), assignment.start * 1000 * 3600 * 24 + tzoff);
    e = Math.min(end.getTime(), assignment.end * 1000 * 3600 * 24 + tzoff);
    span = (e - s) / 1000 / 3600 / 24;
    spanRelative = span - (6 - (new Date(s)).getDay());
    nextSat = e / 1000 / 3600 / 24 - spanRelative;
    n = -6;
    while (n < spanRelative) {
      split.push({
        assignment: num,
        start: new Date(Math.max(s, (nextSat + n) * 1000 * 3600 * 24)),
        end: new Date(Math.min(e, (nextSat + n + 6) * 1000 * 3600 * 24))
      });
      n += 7;
    }
    if (lastAssignments != null) {
      found = false;
      for (num = o = 0, len2 = lastAssignments.length; o < len2; num = ++o) {
        oldAssignment = lastAssignments[num];
        if (oldAssignment.id === assignment.id) {
          found = true;
          if (oldAssignment.body !== assignment.body) {
            addActivity("edit", assignment, true);
          }
          lastAssignments.splice(num, 1);
          break;
        }
      }
      if (!found) {
        addActivity("add", assignment, true);
      }
    }
  }
  if (lastAssignments != null) {
    for (q = 0, len3 = lastAssignments.length; q < len3; q++) {
      assignment = lastAssignments[q];
      addActivity("delete", assignment, true);
    }
    localStorage["activity"] = JSON.stringify(activity.slice(activity.length - 32, activity.length));
  }
  tdst = new Date();
  tdst.setDate(tdst.getDate() - tdst.getDay());
  todayWkId = "wk" + (tdst.getMonth()) + "-" + (tdst.getDate());
  weekHeights = {};
  previousAssignments = {};
  ref2 = document.getElementsByClassName("assignment");
  for (u = 0, len4 = ref2.length; u < len4; u++) {
    assignment = ref2[u];
    previousAssignments[assignment.getAttribute("id")] = assignment;
  }
  fn = function(id) {
    return complete.addEventListener("mouseup", function(evt) {
      var aa, added, el, elem, len6, ref3;
      if (evt.which === 1) {
        el = evt.target;
        while (!el.classList.contains("assignment")) {
          el = el.parentNode;
        }
        added = true;
        if (el.classList.contains("done")) {
          done.splice(done.indexOf(id), 1);
        } else {
          added = false;
          done.push(id);
        }
        localStorage["done"] = JSON.stringify(done);
        if (document.body.getAttribute("data-view") === "1") {
          setTimeout(function() {
            var aa, elem, len6, ref3;
            ref3 = document.querySelectorAll(".assignment[id*=\"" + id + "\"], .upcomingTest[id*=\"test" + id + "\"], .activity[id*=\"activity" + id + "\"]");
            for (aa = 0, len6 = ref3.length; aa < len6; aa++) {
              elem = ref3[aa];
              elem.classList.toggle("done");
            }
            if (added) {
              if (document.querySelectorAll(".assignment.listDisp:not(.done)").length !== 0) {
                document.body.classList.remove("noList");
              }
            } else {
              if (document.querySelectorAll(".assignment.listDisp:not(.done)").length === 0) {
                document.body.classList.add("noList");
              }
            }
            return resize();
          }, 100);
        } else {
          ref3 = document.querySelectorAll(".assignment[id*=\"" + id + "\"], .upcomingTest[id*=\"test" + id + "\"], .activity[id*=\"activity" + id + "\"]");
          for (aa = 0, len6 = ref3.length; aa < len6; aa++) {
            elem = ref3[aa];
            elem.classList.toggle("done");
          }
          if (added) {
            if (document.querySelectorAll(".assignment.listDisp:not(.done)").length !== 0) {
              document.body.classList.remove("noList");
            }
          } else {
            if (document.querySelectorAll(".assignment.listDisp:not(.done)").length === 0) {
              document.body.classList.add("noList");
            }
          }
        }
      }
    });
  };
  for (z = 0, len5 = split.length; z < len5; z++) {
    s = split[z];
    assignment = window.data.assignments[s.assignment];
    separated = separate(window.data.classes[assignment["class"]]);
    startSun = new Date(s.start.getTime());
    startSun.setDate(startSun.getDate() - startSun.getDay());
    weekId = "wk" + (startSun.getMonth()) + "-" + (startSun.getDate());
    smallTag = "small";
    link = null;
    if ((typeof athenaData !== "undefined" && athenaData !== null) && (athenaData[window.data.classes[assignment["class"]]] != null)) {
      link = athenaData[window.data.classes[assignment["class"]]].link;
      smallTag = "a";
    }
    e = element("div", ["assignment", assignment.baseType, "anim"], "<" + smallTag + (link != null ? " href='" + link + "' class='linked'" : "") + "><span class='extra'>" + separated[1] + "</span>" + separated[2] + "</" + smallTag + "><span class='title'>" + assignment.title + "</span><input type='hidden' class='due' value='" + assignment.end + "' />", assignment.id + weekId);
    if (ref3 = assignment.id, indexOf.call(done, ref3) >= 0) {
      e.classList.add("done");
    }
    e.setAttribute("data-class", window.data.classes[assignment["class"]]);
    close = element("a", ["close", "material-icons"], "close");
    close.addEventListener("click", closeOpened);
    e.appendChild(close);
    if (link != null) {
      e.querySelector("a").addEventListener("click", function(evt) {
        var el;
        el = evt.target;
        while (!el.classList.contains("assignment")) {
          el = el.parentNode;
        }
        if (!(document.body.getAttribute("data-view") !== "0" || el.classList.contains("full"))) {
          return evt.preventDefault();
        }
      });
    }
    complete = element("a", ["complete", "material-icons", "waves"], "done");
    ripple(complete);
    id = assignment.id;
    fn(id);
    e.appendChild(complete);
    start = new Date(assignment.start * 1000 * 3600 * 24 + tzoff);
    end = new Date(assignment.end * 1000 * 3600 * 24 + tzoff);
    times = element("div", "range", assignment.start === assignment.end ? dateString(start) : (dateString(start)) + " &ndash; " + (dateString(end)));
    e.appendChild(times);
    if (assignment.attachments.length > 0) {
      attachments = element("div", "attachments");
      ref4 = assignment.attachments;
      fn1 = function(attachment) {
        var a, req;
        a = element("a", [], attachment[0]);
        a.href = location.protocol === "chrome-extension:" ? "https://webappsca.pcrsoft.com/Clue/Common/AttachmentRender.aspx" + attachment[1] : "/api/attachment" + attachment[1];
        req = new XMLHttpRequest();
        req.open("HEAD", a.href);
        req.onload = function() {
          var type;
          if (req.status === 200) {
            type = req.getResponseHeader("Content-Type");
            if (mimeTypes[type] != null) {
              a.classList.add(mimeTypes[type][1]);
              span = element("span", [], mimeTypes[type][0]);
            } else {
              span = element("span", [], "Unknown file type");
            }
            a.appendChild(span);
          }
        };
        req.send();
        attachments.appendChild(a);
      };
      for (aa = 0, len6 = ref4.length; aa < len6; aa++) {
        attachment = ref4[aa];
        fn1(attachment);
      }
      e.appendChild(attachments);
    }
    e.appendChild(element("div", "body", assignment.body));
    if (start < s.start) {
      e.classList.add("fromWeekend");
    }
    if (end > s.end) {
      e.classList.add("overWeekend");
    }
    e.classList.add("s" + (s.start.getDay()));
    e.classList.add("e" + (6 - s.end.getDay()));
    if ((Math.floor(s.start / 1000 / 3600 / 24) <= today && today <= Math.floor(s.end / 1000 / 3600 / 24))) {
      e.classList.add("listDisp");
    }
    pos = 0;
    while (true) {
      found = true;
      d = new Date(s.start);
      while (d <= s.end) {
        if (taken[d].indexOf(pos) !== -1) {
          found = false;
        }
        d.setDate(d.getDate() + 1);
      }
      if (found) {
        break;
      }
      pos++;
    }
    d = new Date(s.start);
    while (d <= s.end) {
      taken[d].push(pos);
      d.setDate(d.getDate() + 1);
    }
    e.style.marginTop = pos * 30 + "px";
    e.addEventListener("click", function(evt) {
      var back, el;
      el = evt.target;
      while (!el.classList.contains("assignment")) {
        el = el.parentNode;
      }
      if (document.getElementsByClassName("full").length === 0 && document.body.getAttribute("data-view") === "0") {
        el.classList.remove("anim");
        el.classList.add("modify");
        el.style.top = el.getBoundingClientRect().top - document.body.scrollTop - parseInt(el.style.marginTop) + 44 + "px";
        el.setAttribute("data-top", el.style.top);
        document.body.style.overflow = "hidden";
        back = document.getElementById("background");
        back.classList.add("active");
        back.style.display = "block";
        el.classList.add("anim");
        setTimeout(function() {
          el.classList.add("full");
          el.style.top = 75 - parseInt(el.style.marginTop) + "px";
          return setTimeout(function() {
            return el.classList.remove("anim");
          }, 350);
        }, 0);
      }
    });
    wk = document.getElementById(weekId);
    if (assignment.baseType === "test" && assignment.start >= today) {
      te = element("div", ["upcomingTest", "assignmentItem", "test"], "<i class='material-icons'>assessment</i><span class='title'>" + assignment.title + "</span><small>" + separated[2] + "</small><div class='range'>" + (dateString(end, true)) + "</div>", "test" + assignment.id);
      te.setAttribute("data-class", window.data.classes[assignment["class"]]);
      id = assignment.id;
      (function(id) {
        return te.addEventListener("click", function() {
          var doScrolling;
          doScrolling = function() {
            var el;
            el = document.querySelector(".assignment[id*=\"" + id + "\"]");
            return smoothScroll(el.getBoundingClientRect().top + document.body.scrollTop - 116).then(function() {
              el.click();
            });
          };
          if (document.body.getAttribute("data-view") === "0") {
            return doScrolling();
          } else {
            document.querySelector("#navTabs>li:first-child").click();
            return setTimeout(doScrolling, 500);
          }
        });
      })(id);
      if (ref5 = assignment.id, indexOf.call(done, ref5) >= 0) {
        te.classList.add("done");
      }
      if (document.getElementById("test" + assignment.id) != null) {
        document.getElementById("test" + assignment.id).innerHTML = te.innerHTML;
      } else {
        document.getElementById("infoTests").appendChild(te);
      }
    }
    if ((weekHeights[weekId] == null) || pos > weekHeights[weekId]) {
      weekHeights[weekId] = pos;
      wk.style.height = 47 + (pos + 1) * 30 + "px";
    }
    already = document.getElementById(assignment.id + weekId);
    if (already != null) {
      already.style.marginTop = e.style.marginTop;
      already.getElementsByClassName("body")[0].innerHTML = e.getElementsByClassName("body")[0].innerHTML;
    } else {
      wk.appendChild(e);
    }
    delete previousAssignments[assignment.id + weekId];
  }
  for (name in previousAssignments) {
    assignment = previousAssignments[name];
    if (assignment.classList.contains("full")) {
      document.getElementById("background").classList.remove("active");
    }
    assignment.remove();
  }
  if (weekHeights[todayWkId] != null) {
    h = 0;
    sw = function(wkid) {
      var ab, len7, ref6, results, x;
      ref6 = wkid.substring(2).split("-");
      results = [];
      for (ab = 0, len7 = ref6.length; ab < len7; ab++) {
        x = ref6[ab];
        results.push(parseInt(x));
      }
      return results;
    };
    todayWk = sw(todayWkId);
    for (wkId in weekHeights) {
      val = weekHeights[wkId];
      wk = sw(wkId);
      if (wk[0] < todayWk[0] || (wk[0] === todayWk[0] && wk[1] < todayWk[1])) {
        h += val;
      }
    }
    scroll = h * 30 + 112 + 14;
    if (scroll < 50) {
      scroll = 0;
    }
    if (document.body.getAttribute("data-view") === "0") {
      window.scrollTo(0, scroll);
    }
  }
  if (document.querySelectorAll(".assignment.listDisp:not(.done)").length === 0) {
    document.body.classList.add("noList");
  }
  if (document.body.getAttribute("data-view") === "1") {
    resize();
    setTimeout(resize, 300);
  }
  return console.timeEnd("Displaying data");
};

closeOpened = function(evt) {
  var back, el;
  evt.stopPropagation();
  el = document.querySelector(".full");
  el.style.top = el.getAttribute("data-top");
  el.classList.add("anim");
  el.classList.remove("full");
  el.scrollTop = 0;
  document.body.style.overflow = "auto";
  back = document.getElementById("background");
  back.classList.remove("active");
  return setTimeout(function() {
    back.style.display = "none";
    el.classList.remove("anim");
    el.classList.remove("modify");
    el.style.top = "auto";
    el.offsetHeight;
    return el.classList.add("anim");
  }, 1000);
};

document.getElementById("background").addEventListener("click", closeOpened);

ripple = function(el) {
  el.addEventListener("mousedown", function(evt) {
    var e, size, target, wave, x, y;
    if (evt.which === 1) {
      target = evt.target.classList.contains("wave") ? evt.target.parentNode : evt.target;
      wave = element("span", "wave");
      size = Math.max(parseInt(target.offsetWidth), parseInt(target.offsetHeight));
      wave.style.width = wave.style.height = size + "px";
      e = evt.target;
      x = evt.pageX;
      y = evt.pageY;
      while (e) {
        x -= e.offsetLeft;
        y -= e.offsetTop;
        e = e.offsetParent;
      }
      wave.style.top = y - size / 2 + "px";
      wave.style.left = x - size / 2 + "px";
      target.appendChild(wave);
      wave.setAttribute("data-hold", Date.now());
      wave.offsetWidth;
      wave.style.transform = "scale(2.5)";
    }
  });
  el.addEventListener("mouseup", function(evt) {
    var fn, j, len, target, wave, waves;
    if (evt.which === 1) {
      target = evt.target.classList.contains("wave") ? evt.target.parentNode : evt.target;
      waves = target.getElementsByClassName("wave");
      fn = function(wave) {
        var delay, diff;
        diff = Date.now() - Number(wave.getAttribute("data-hold"));
        delay = Math.max(350 - diff, 0);
        return setTimeout(function() {
          wave.style.opacity = "0";
          return setTimeout(function() {
            return wave.remove();
          }, 550);
        }, delay);
      };
      for (j = 0, len = waves.length; j < len; j++) {
        wave = waves[j];
        fn(wave);
      }
    }
  });
};

if (localStorage["view"] != null) {
  document.body.setAttribute("data-view", localStorage["view"]);
}

ref = document.querySelectorAll("#navTabs>li");
for (j = 0, len = ref.length; j < len; j++) {
  tab = ref[j];
  tab.addEventListener("click", function(evt) {
    var assignment, assignments, columnHeights, columns, index, k, l, len1, len2, ref1, start, step, trans, w, widths;
    ga('send', 'event', 'navigation', evt.target.textContent, {
      page: '/new.html',
      title: "Version " + (localStorage["commit"] || "New")
    });
    trans = JSON.parse(localStorage["viewTrans"]);
    if (!trans) {
      document.body.classList.add("noTrans");
      document.body.offsetHeight;
    }
    document.body.setAttribute("data-view", localStorage["view"] = (Array.prototype.slice.call(document.querySelectorAll("#navTabs>li"))).indexOf(evt.target));
    if (document.body.getAttribute("data-view") === "1") {
      window.addEventListener("resize", resize);
      if (trans) {
        start = null;
        widths = document.body.classList.contains("showInfo") ? [650, 1100, 1800, 2700, 3800, 5100] : [350, 800, 1500, 2400, 3500, 4800];
        columns = null;
        for (index = k = 0, len1 = widths.length; k < len1; index = ++k) {
          w = widths[index];
          if (window.innerWidth > w) {
            columns = index + 1;
          }
        }
        assignments = getResizeAssignments();
        columnHeights = (function() {
          var l, ref1, results;
          results = [];
          for (l = 0, ref1 = columns; 0 <= ref1 ? l < ref1 : l > ref1; 0 <= ref1 ? l++ : l--) {
            results.push(0);
          }
          return results;
        })();
        step = function(timestamp) {
          var assignment, col, l, len2, n;
          if (start == null) {
            start = timestamp;
          }
          for (n = l = 0, len2 = assignments.length; l < len2; n = ++l) {
            assignment = assignments[n];
            col = n % columns;
            if (n < columns) {
              columnHeights[col] = 0;
            }
            assignment.style.top = columnHeights[col] + "px";
            assignment.style.left = 100 / columns * col + "%";
            assignment.style.right = 100 / columns * (columns - col - 1) + "%";
            columnHeights[col] += assignment.offsetHeight + 24;
          }
          if (timestamp - start < 350) {
            return window.requestAnimationFrame(step);
          }
        };
        window.requestAnimationFrame(step);
        setTimeout(function() {
          var assignment, col, l, len2, n;
          for (n = l = 0, len2 = assignments.length; l < len2; n = ++l) {
            assignment = assignments[n];
            col = n % columns;
            if (n < columns) {
              columnHeights[col] = 0;
            }
            assignment.style.top = columnHeights[col] + "px";
            columnHeights[col] += assignment.offsetHeight + 24;
          }
        }, 350);
      } else {
        resize();
      }
    } else {
      window.scrollTo(0, scroll);
      document.querySelector("nav").classList.add("headroom--locked");
      setTimeout(function() {
        document.querySelector("nav").classList.remove("headroom--unpinned");
        document.querySelector("nav").classList.remove("headroom--locked");
        return document.querySelector("nav").classList.add("headroom--pinned");
      }, 350);
      window.removeEventListener("resize", resize);
      ref1 = document.getElementsByClassName("assignment");
      for (l = 0, len2 = ref1.length; l < len2; l++) {
        assignment = ref1[l];
        assignment.style.top = "auto";
      }
    }
    if (!trans) {
      document.body.offsetHeight;
      setTimeout(function() {
        return document.body.classList.remove("noTrans");
      }, 350);
    }
  });
}

ref1 = document.querySelectorAll("#infoTabs>li");
for (k = 0, len1 = ref1.length; k < len1; k++) {
  tab = ref1[k];
  tab.addEventListener("click", function(evt) {
    return document.getElementById("info").setAttribute("data-view", (Array.prototype.slice.call(document.querySelectorAll("#infoTabs>li"))).indexOf(evt.target));
  });
}

getResizeAssignments = function() {
  var assignments;
  assignments = Array.prototype.slice.call(document.querySelectorAll(document.body.classList.contains("showDone") ? ".assignment.listDisp" : ".assignment.listDisp:not(.done)"));
  assignments.sort(function(a, b) {
    var ad, bd;
    ad = a.classList.contains("done");
    bd = b.classList.contains("done");
    if (ad && !bd) {
      return 1;
    }
    if (bd && !ad) {
      return -1;
    }
    return a.getElementsByClassName("due")[0].value - b.getElementsByClassName("due")[0].value;
  });
  return assignments;
};

resize = function() {
  var assignment, assignments, col, columnHeights, columns, index, l, len2, len3, n, o, w, widths;
  widths = document.body.classList.contains("showInfo") ? [650, 1100, 1800, 2700, 3800, 5100] : [350, 800, 1500, 2400, 3500, 4800];
  columns = null;
  for (index = l = 0, len2 = widths.length; l < len2; index = ++l) {
    w = widths[index];
    if (window.innerWidth > w) {
      columns = index + 1;
    }
  }
  columnHeights = (function() {
    var o, ref2, results;
    results = [];
    for (o = 0, ref2 = columns; 0 <= ref2 ? o < ref2 : o > ref2; 0 <= ref2 ? o++ : o--) {
      results.push(0);
    }
    return results;
  })();
  assignments = getResizeAssignments();
  for (n = o = 0, len3 = assignments.length; o < len3; n = ++o) {
    assignment = assignments[n];
    col = n % columns;
    assignment.style.top = columnHeights[col] + "px";
    assignment.style.left = 100 / columns * col + "%";
    assignment.style.right = 100 / columns * (columns - col - 1) + "%";
    columnHeights[col] += assignment.offsetHeight + 24;
  }
  setTimeout(function() {
    var len4, q;
    for (n = q = 0, len4 = assignments.length; q < len4; n = ++q) {
      assignment = assignments[n];
      col = n % columns;
      if (n < columns) {
        columnHeights[col] = 0;
      }
      assignment.style.top = columnHeights[col] + "px";
      columnHeights[col] += assignment.offsetHeight + 24;
    }
  }, 500);
};

ref2 = document.querySelectorAll("input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search]");
for (l = 0, len2 = ref2.length; l < len2; l++) {
  input = ref2[l];
  input.addEventListener("change", function(evt) {
    return evt.target.parentNode.querySelector("label").classList.add("active");
  });
  input.addEventListener("focus", function(evt) {
    return evt.target.parentNode.querySelector("label").classList.add("active");
  });
  input.addEventListener("blur", function(evt) {
    if (evt.target.value.length === 0) {
      return evt.target.parentNode.querySelector("label").classList.remove("active");
    }
  });
}

window.addEventListener("keydown", function(evt) {
  if (evt.which === 27) {
    if (document.getElementsByClassName("full").length !== 0) {
      return closeOpened(new Event("Generated Event"));
    }
  }
});

navToggle = function(element, ls, f) {
  ripple(document.getElementById(element));
  document.getElementById(element).addEventListener("mouseup", function() {
    document.body.classList.toggle(ls);
    resize();
    localStorage[ls] = JSON.stringify(document.body.classList.contains(ls));
    if (f != null) {
      return f();
    }
  });
  if ((localStorage[ls] != null) && JSON.parse(localStorage[ls])) {
    return document.body.classList.add(ls);
  }
};

navToggle("cvButton", "showDone", function() {
  return setTimeout(resize, 1000);
});

if (localStorage["showInfo"] == null) {
  localStorage["showInfo"] = JSON.stringify(true);
}

navToggle("infoButton", "showInfo");

navToggle("lightButton", "dark");

headroom = new Headroom(document.querySelector("nav"), {
  tolerance: 10,
  offset: 66
});

headroom.init();

document.getElementById("collapseButton").addEventListener("click", function() {
  document.body.style.overflow = "hidden";
  document.getElementById("sideNav").classList.add("active");
  return document.getElementById("sideBackground").style.display = "block";
});

document.getElementById("sideBackground").addEventListener("click", function() {
  document.getElementById("sideBackground").style.opacity = 0;
  document.getElementById("sideNav").classList.remove("active");
  document.getElementById("dragTarget").style.width = "";
  return setTimeout(function() {
    document.body.style.overflow = "auto";
    return document.getElementById("sideBackground").style.display = "none";
  }, 350);
});

labrgb = function(_L, _a, _b) {
  var _B, _G, _R, _X, _Y, _Z, dot_product, f_inv, from_linear, lab_e, lab_k, m, n, ref_X, ref_Y, ref_Z, tuple, var_x, var_y, var_z;
  ref_X = 0.95047;
  ref_Y = 1.00000;
  ref_Z = 1.08883;
  lab_e = 0.008856;
  lab_k = 903.3;
  f_inv = function(t) {
    if (Math.pow(t, 3) > lab_e) {
      return Math.pow(t, 3);
    } else {
      return (116 * t - 16) / lab_k;
    }
  };
  dot_product = function(a, b) {
    var i, o, ref3, ret;
    ret = 0;
    for (i = o = 0, ref3 = a.length - 1; 0 <= ref3 ? o <= ref3 : o >= ref3; i = 0 <= ref3 ? ++o : --o) {
      ret += a[i] * b[i];
    }
    return ret;
  };
  var_y = (_L + 16) / 116;
  var_z = var_y - _b / 200;
  var_x = _a / 500 + var_y;
  _X = ref_X * f_inv(var_x);
  _Y = ref_Y * f_inv(var_y);
  _Z = ref_Z * f_inv(var_z);
  tuple = [_X, _Y, _Z];
  m = [[3.2406, -1.5372, -0.4986], [-0.9689, 1.8758, 0.0415], [0.0557, -0.2040, 1.0570]];
  from_linear = function(c) {
    var a;
    a = 0.055;
    if (c <= 0.0031308) {
      return 12.92 * c;
    } else {
      return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    }
  };
  _R = from_linear(dot_product(m[0], tuple));
  _G = from_linear(dot_product(m[1], tuple));
  _B = from_linear(dot_product(m[2], tuple));
  n = function(v) {
    return Math.round(Math.max(Math.min(v * 256, 255), 0));
  };
  return "rgb(" + (n(_R)) + ", " + (n(_G)) + ", " + (n(_B)) + ")";
};

updateAvatar = function() {
  var bg, initials;
  if (localStorage["username"] != null) {
    document.getElementById("user").innerHTML = localStorage["username"];
    initials = localStorage["username"].match(/\d*(.).*?(.$)/);
    bg = labrgb(50, (initials[1].charCodeAt(0) - 65) / 26 * 256 - 128, (initials[2].charCodeAt(0) - 65) / 26 * 256 - 128);
    document.getElementById("initials").style.backgroundColor = bg;
    return document.getElementById("initials").innerHTML = initials[1] + initials[2];
  }
};

updateAvatar();

lastAthena = localStorage["lastAthena"] ? parseInt(localStorage["lastAthena"]) : 0;

athenaData = localStorage["athenaData"] != null ? JSON.parse(localStorage["athenaData"]) : null;

if (location.protocol === "chrome-extension:" && Date.now() - lastAthena >= 1000 * 3600 * 24 && (navigator.onLine || (navigator.onLine == null)) && (localStorage["noSchoology"] == null)) {
  console.log("Updating classes from Athena");
  send("https://athena.harker.org/iapi/course/active", "json").then(function(resp) {
    var course, courseDetails, len3, n, o, ref3;
    if (resp.responseURL.indexOf("login") !== -1) {
      return console.log("Couldn't fetch courses from Athena because you're not logged in.");
    } else {
      athenaData = {};
      localStorage["lastAthena"] = Date.now();
      if (resp.response.response_code === 200) {
        ref3 = resp.response.body.courses.courses;
        for (n = o = 0, len3 = ref3.length; o < len3; n = ++o) {
          course = ref3[n];
          courseDetails = resp.response.body.courses.sections[n];
          athenaData[course.course_title] = {
            link: "https://athena.harker.org" + courseDetails.link,
            logo: courseDetails.logo.substr(0, courseDetails.logo.indexOf("\" alt=\"")).replace("<div class=\"profile-picture\"><img src=\"", "").replace("tiny", "reg"),
            period: courseDetails.section_title
          };
        }
        return localStorage["athenaData"] = JSON.stringify(athenaData);
      }
    }
  }, function(error) {
    if (!confirm("Please grant the extension permission to access Athena/Schoology.\nYou can do this by going to chrome://extensions then clicking the \"Reload\" button under Check PCR.\n\nIf you don't want Check PCR to access Schoology, click the cancel button. Otherwise, just click OK.")) {
      return localStorage["noSchoology"] = "true";
    }
  });
}

document.getElementById("settingsB").addEventListener("click", function() {
  document.getElementById("sideBackground").click();
  document.body.classList.add("settingsShown");
  document.getElementById("brand").innerHTML = "Settings";
  return setTimeout(function() {
    return document.querySelector("main").style.display = "none";
  });
});

document.getElementById("backButton").addEventListener("click", function() {
  document.querySelector("main").style.display = "block";
  document.body.classList.remove("settingsShown");
  return document.getElementById("brand").innerHTML = "Check PCR";
});

if (localStorage["viewTrans"] == null) {
  localStorage["viewTrans"] = JSON.stringify(true);
}

if (localStorage["googleA"] == null) {
  localStorage["googleA"] = JSON.stringify(true);
}

if (localStorage["colorType"] == null) {
  localStorage["colorType"] = "assignment";
}

if (localStorage["assignmentColors"] == null) {
  localStorage["assignmentColors"] = JSON.stringify({
    homework: "#2196f3",
    classwork: "#689f38",
    test: "#f44336",
    projects: "#f57c00"
  });
}

if ((localStorage["data"] != null) && (localStorage["classColors"] == null)) {
  a = {};
  ref3 = JSON.parse(localStorage["data"]).classes;
  for (o = 0, len3 = ref3.length; o < len3; o++) {
    c = ref3[o];
    a[c] = "#616161";
  }
  localStorage["classColors"] = JSON.stringify(a);
}

if (localStorage["assignmentColors"] == null) {
  localStorage["assignmentColors"] = JSON.stringify({
    homework: "#2196f3",
    classwork: "#689f38",
    test: "#f44336",
    projects: "#f57c00"
  });
}

document.getElementById(localStorage["colorType"] + "Colors").style.display = "block";

if (localStorage["refreshOnFocus"] == null) {
  localStorage["refreshOnFocus"] = JSON.stringify(true);
}

window.addEventListener("focus", function() {
  if (JSON.parse(localStorage["refreshOnFocus"])) {
    return fetch();
  }
});

if (localStorage["refreshRate"] == null) {
  localStorage["refreshRate"] = JSON.stringify(-1);
}

intervalRefresh = function() {
  var r;
  r = JSON.parse(localStorage["refreshRate"]);
  if (r > 0) {
    return setTimeout(function() {
      console.debug("Refreshing because of timer");
      fetch();
      return intervalRefresh();
    }, r * 60 * 1000);
  }
};

intervalRefresh();

ac = JSON.parse(localStorage["assignmentColors"]);

cc = localStorage["classColors"] != null ? JSON.parse(localStorage["classColors"]) : {};

rgb2hex = function(rgb) {
  var hex;
  if (/^#[0-9A-F]{6}$/i.test(rgb)) {
    return rgb;
  }
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  hex = function(x) {
    return ("0" + parseInt(x).toString(16)).slice(-2);
  };
  return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
};

hex2rgb = function(hex) {
  var result;
  result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
};

palette = {
  "#f44336": "#B71C1C",
  "#e91e63": "#880E4F",
  "#9c27b0": "#4A148C",
  "#673ab7": "#311B92",
  "#3f51b5": "#1A237E",
  "#2196f3": "#0D47A1",
  "#03a9f4": "#01579B",
  "#00bcd4": "#006064",
  "#009688": "#004D40",
  "#4caf50": "#1B5E20",
  "#689f38": "#33691E",
  "#afb42b": "#827717",
  "#fbc02d": "#F57F17",
  "#ffa000": "#FF6F00",
  "#f57c00": "#E65100",
  "#ff5722": "#BF360C",
  "#795548": "#3E2723",
  "#616161": "#212121"
};

if (localStorage["data"] != null) {
  ref4 = JSON.parse(localStorage["data"]).classes;
  for (q = 0, len4 = ref4.length; q < len4; q++) {
    c = ref4[q];
    d = element("div", [], c);
    d.setAttribute("data-control", c);
    d.appendChild(element("span", []));
    document.getElementById("classColors").appendChild(d);
  }
}

ref5 = document.getElementsByClassName("colors");
for (u = 0, len5 = ref5.length; u < len5; u++) {
  e = ref5[u];
  ref6 = e.getElementsByTagName("div");
  fn = function(sp, color, list, listName) {
    return sp.addEventListener("click", function(evt) {
      var bg;
      if (sp.classList.contains("choose")) {
        bg = rgb2hex(evt.target.style.backgroundColor);
        list[color.getAttribute("data-control")] = bg;
        sp.style.backgroundColor = bg;
        sp.querySelector(".selected").classList.remove("selected");
        evt.target.classList.add("selected");
        localStorage[listName] = JSON.stringify(list);
        updateColors();
      }
      return sp.classList.toggle("choose");
    });
  };
  for (z = 0, len6 = ref6.length; z < len6; z++) {
    color = ref6[z];
    sp = color.querySelector("span");
    listName = e.getAttribute("id") === "classColors" ? "classColors" : "assignmentColors";
    list = e.getAttribute("id") === "classColors" ? cc : ac;
    sp.style.backgroundColor = list[color.getAttribute("data-control")];
    for (p in palette) {
      pe = element("span", []);
      pe.style.backgroundColor = p;
      if (p === list[color.getAttribute("data-control")]) {
        pe.classList.add("selected");
      }
      sp.appendChild(pe);
    }
    fn(sp, color, list, listName);
  }
}

updateColors = function() {
  var mix, name, ref7, ref8, results, results1, sheet, style;
  mix = function(a, b, p) {
    var hex, rgbA, rgbB;
    rgbA = hex2rgb(a);
    rgbB = hex2rgb(b);
    hex = function(x) {
      return ("0" + parseInt(x).toString(16)).slice(-2);
    };
    return "#" + hex(rgbA[0] * p + rgbB[0] * (1 - p)) + hex(rgbA[1] * p + rgbB[1] * (1 - p)) + hex(rgbA[2] * p + rgbB[2] * (1 - p));
  };
  style = document.createElement("style");
  style.appendChild(document.createTextNode(""));
  document.head.appendChild(style);
  sheet = style.sheet;
  if (localStorage["colorType"] === "assignment") {
    ref7 = JSON.parse(localStorage["assignmentColors"]);
    results = [];
    for (name in ref7) {
      color = ref7[name];
      sheet.insertRule(".assignment." + name + " { background-color: " + color + "; }", 0);
      sheet.insertRule(".assignment." + name + ".done { background-color: " + palette[color] + "; }", 0);
      sheet.insertRule(".assignment." + name + "::before { background-color: " + (mix(color, "#1B5E20", 0.3)) + "; }", 0);
      sheet.insertRule(".assignmentItem." + name + ">i { background-color: " + color + "; }", 0);
      results.push(sheet.insertRule(".assignmentItem." + name + ".done>i { background-color: " + palette[color] + "; }", 0));
    }
    return results;
  } else {
    ref8 = JSON.parse(localStorage["classColors"]);
    results1 = [];
    for (name in ref8) {
      color = ref8[name];
      sheet.insertRule(".assignment[data-class=\"" + name + "\"] { background-color: " + color + "; }", 0);
      sheet.insertRule(".assignment[data-class=\"" + name + "\"].done { background-color: " + palette[color] + "; }", 0);
      sheet.insertRule(".assignment[data-class=\"" + name + "\"]::before { background-color: " + (mix(color, "#1B5E20", 0.3)) + "; }", 0);
      sheet.insertRule(".assignmentItem[data-class=\"" + name + "\"]>i { background-color: " + color + "; }", 0);
      results1.push(sheet.insertRule(".assignmentItem[data-class=\"" + name + "\"].done>i { background-color: " + palette[color] + "; }", 0));
    }
    return results1;
  }
};

updateColors();

ref7 = document.getElementsByClassName("settingsControl");
for (aa = 0, len7 = ref7.length; aa < len7; aa++) {
  e = ref7[aa];
  if (localStorage[e.name] != null) {
    if (e.checked != null) {
      e.checked = JSON.parse(localStorage[e.name]);
    } else {
      e.value = JSON.parse(localStorage[e.name]);
    }
  }
  e.addEventListener("change", function(evt) {
    if (evt.target.checked != null) {
      localStorage[evt.target.name] = JSON.stringify(evt.target.checked);
    } else {
      localStorage[evt.target.name] = JSON.stringify(evt.target.value);
    }
    if (evt.target.name === "refreshRate") {
      return intervalRefresh();
    }
  });
}

document.querySelector("input[name=\"colorType\"][value=\"" + localStorage["colorType"] + "\"]").checked = true;

ref8 = document.getElementsByName("colorType");
for (ab = 0, len8 = ref8.length; ab < len8; ab++) {
  c = ref8[ab];
  c.addEventListener("change", function(evt) {
    var v;
    v = document.querySelector('input[name="colorType"]:checked').value;
    localStorage["colorType"] = v;
    if (v === "class") {
      document.getElementById("assignmentColors").style.display = "none";
      document.getElementById("classColors").style.display = "block";
    } else {
      document.getElementById("assignmentColors").style.display = "block";
      document.getElementById("classColors").style.display = "none";
    }
    return updateColors();
  });
}

done = [];

if (localStorage["done"] != null) {
  done = JSON.parse(localStorage["done"]);
}

document.getElementById("lastUpdate").innerHTML = localStorage["lastUpdate"] != null ? formatUpdate(localStorage["lastUpdate"]) : "Never";

if (localStorage["data"] != null) {
  window.data = JSON.parse(localStorage["data"]);
  if (localStorage["activity"] != null) {
    activity = JSON.parse(localStorage["activity"]);
    for (ae = 0, len9 = activity.length; ae < len9; ae++) {
      act = activity[ae];
      addActivity(act[0], act[1], act[2]);
    }
  }
  display();
}

fetch();

if (location.protocol !== "chrome-extension:") {
  document.getElementById("brand").innerHTML = "Check PCR <b>Preview</b>";
  lc = document.querySelector("#login .content");
  document.getElementById("login").classList.add("large");
  lc.appendChild(element("span", [], "<b>This is a preview of the online version of Check PCR. This means that the online version is far from finished and several features are missing (e.g. Schoology integration). If you encounter any bugs, please report them to <a href='https://github.com/19RyanA/CheckPCR/issues'>GitHub</a>.</b>\nThe online version of Check PCR will send your login credentials through the server hosting this website so that it can fetch your assignments from PCR.\nIf you do not trust me to avoid stealing your credentials, you can use\n<a href='https://github.com/19RyanA/CheckPCR'>the unofficial Check PCR chrome extension</a>, which will communicate directly with PCR and thus not send any data through this server.", "loginExtra"));
  up = document.getElementById("update");
  upc = up.getElementsByClassName("content")[0];
  up.querySelector("h1").innerHTML = "A new update has been applied.";
  ref9 = upc.childNodes;
  for (af = ref9.length - 1; af >= 0; af += -1) {
    el = ref9[af];
    if (el.nodeType === 3 || el.tagName === "BR" || el.tagName === "CODE" || el.tagName === "A") {
      el.remove();
    }
  }
  upc.insertBefore(document.createTextNode("Because you are using the online version, the update has already been download. Click GOT IT to reload the page and apply the changes."), upc.querySelector("h2"));
  lc.appendChild(element("div", [], "While this feature is very useful, it will store your credentials on the server's database. If you are uncomfortable with this, then unckeck the box to only have the servery proxy your credentials to PCR.", "storeAbout"));
  document.getElementById("updateDelay").style.display = "none";
  document.getElementById("updateIgnore").innerHTML = "GOT IT";
  document.getElementById("updateIgnore").style.right = "8px";
}

gp = {
  page: '/new.html',
  title: location.protocol === "chrome-extension:" ? "Version " + (localStorage["commit"] || "New") : "Online"
};

if (!JSON.parse(localStorage["googleA"])) {
  window['ga-disable-UA-66932824-1'] = true;
}

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');;

ga('create', 'UA-66932824-1', 'auto');

ga('set', 'checkProtocolTask', (function() {}));

ga('require', 'displayfeatures');

ga('send', 'pageview', gp);

if (localStorage["askGoogleAnalytics"] == null) {
  snackbar("This page uses Google Analytics. You can opt out vai Settings.", "Settings", function() {
    return document.getElementById("settingsB").click();
  });
  localStorage["askGoogleAnalytics"] = "false";
}

delete Hammer.defaults.cssProps.userSelect;

hammertime = new Hammer.Manager(document.body, {
  recognizers: [
    [
      Hammer.Pan, {
        direction: Hammer.DIRECTION_HORIZONTAL
      }
    ]
  ]
});

menuOut = false;

dragTarget = new Hammer(document.getElementById("dragTarget"));

dragTarget.on("pan", function(e) {
  var direction, overlayPerc, sbkg, x, y;
  if (e.pointerType === "touch") {
    e.preventDefault();
    direction = e.direction;
    x = e.center.x;
    y = e.center.y;
    sbkg = document.getElementById("sideBackground");
    sbkg.style.display = "block";
    sbkg.style.opacity = 0;
    document.getElementById("sideNav").classList.add("manual");
    if (x > 240) {
      x = 240;
    } else if (x < 0) {
      x = 0;
      if (x < 120) {
        menuOut = false;
      } else if (x >= 120) {
        menuOut = true;
      }
    }
    document.getElementById("sideNav").style.transform = "translateX(" + (x - 240) + "px)";
    overlayPerc = Math.min(x / 480, 0.5);
    return sbkg.style.opacity = overlayPerc;
  }
});

dragTarget.on("panend", function(e) {
  var sideNav, velocityX;
  if (e.pointerType === "touch") {
    velocityX = e.velocityX;
    if ((menuOut && velocityX <= 0.3) || velocityX < -0.5) {
      sideNav = document.getElementById("sideNav");
      sideNav.classList.remove("manual");
      sideNav.classList.add("active");
      sideNav.style.transform = "";
      return document.getElementById("dragTarget").style.width = "100%";
    } else if (!menuOut || velocityX > 0.3) {
      document.body.style.overflow = "auto";
      sideNav = document.getElementById("sideNav");
      sideNav.classList.remove("manual");
      sideNav.classList.remove("active");
      sideNav.style.transform = "";
      document.getElementById("sideBackground").style.opacity = "";
      document.getElementById("dragTarget").style.width = "10px";
      return setTimeout(function() {
        return document.getElementById("sideBackground").style.display = "none";
      }, 350);
    }
  }
});

dragTarget.on("tap", function(e) {
  document.getElementById("sideBackground").click();
  return e.preventDefault();
});

dt = document.getElementById("dragTarget");

hammertime.on("pan", function(e) {
  if (e.deltaX < -100 || e.deltaX > 100 && e.target !== dt) {
    if (e.velocityX > 0.3) {
      el = document.querySelector("#navTabs>li:nth-child(" + (document.body.getAttribute("data-view") + 2) + ")");
    } else if (e.velocityX < -0.3) {
      el = document.querySelector("#navTabs>li:nth-child(" + (document.body.getAttribute("data-view")) + ")");
    }
    if (el != null) {
      el.click();
    }
  }
});

ripple(document.getElementById("filterActivity"));

document.getElementById("filterActivity").addEventListener("click", function() {
  return document.getElementById("infoActivity").classList.toggle("filter");
});

activityTypes = localStorage["shownActivity"] ? JSON.parse(localStorage["shownActivity"]) : {
  add: true,
  edit: true,
  "delete": true
};

updateSelectNum = function() {
  c = function(bool) {
    if (bool) {
      return 1;
    } else {
      return 0;
    }
  };
  return document.getElementById("selectNum").innerHTML = c(activityTypes.add) + c(activityTypes.edit) + c(activityTypes["delete"]);
};

updateSelectNum();

fn1 = function(type) {
  return document.getElementById(type + "Select").addEventListener("change", function(evt) {
    activityTypes[type] = evt.target.checked;
    document.getElementById("infoActivity").setAttribute("data-filtered", updateSelectNum());
    document.getElementById("infoActivity").classList.toggle(type);
    return localStorage["shownActivity"] = JSON.stringify(activityTypes);
  });
};
for (type in activityTypes) {
  enabled = activityTypes[type];
  document.getElementById(type + "Select").checked = enabled;
  if (enabled) {
    document.getElementById("infoActivity").classList.add(type);
  }
  fn1(type);
}

checkCommit = function() {
  return send((location.protocol === "chrome-extension:" ? "https://api.github.com/repos/19RyanA/CheckPCR/git/refs/heads/master" : "/api/commit"), "json").then(function(resp) {
    var last;
    last = localStorage["commit"];
    c = resp.response.object.sha;
    console.debug(last, c);
    if (last == null) {
      return localStorage["commit"] = c;
    } else if (last !== c) {
      document.getElementById("updateIgnore").addEventListener("click", function() {
        localStorage["commit"] = c;
        if (location.protocol === "chrome-extension:") {
          document.getElementById("update").classList.remove("active");
          return setTimeout(function() {
            return document.getElementById("updateBackground").style.display = "none";
          }, 350);
        } else {
          return window.location.reload();
        }
      });
      return send((location.protocol === "chrome-extension" ? resp.response.object.url : "/api/commit/" + c), "json").then(function(resp) {
        document.getElementById("updateFeatures").innerHTML = resp.response.message.substr(resp.response.message.indexOf("\n\n") + 2).replace(/\* (.*?)(?=$|\n)/g, function(a, b) {
          return "<li>" + b + "</li>";
        }).replace(/>\n</g, "><").replace(/\n/g, "<br>");
        document.getElementById("updateBackground").style.display = "block";
        return document.getElementById("update").classList.add("active");
      });
    }
  }, function(err) {
    return console.log("Could not access Github. Here's the error:", err);
  });
};

firstTime = !localStorage["commit"];

if (location.protocol === "chrome-extension:" || firstTime) {
  checkCommit();
}

window.applicationCache.addEventListener("updateready", checkCommit);

document.getElementById("updateDelay").addEventListener("click", function() {
  document.getElementById("update").classList.remove("active");
  return setTimeout(function() {
    return document.getElementById("updateBackground").style.display = "none";
  }, 350);
});

send("https://api.github.com/gists/b42a5a3c491be081e9c9", "json").then(function(resp) {
  var last, nc;
  last = localStorage["newsCommit"];
  nc = resp.response.history[0].version;
  window.getNews = function(onfail) {
    return send(resp.response.files["updates.htm"].raw_url).then(function(resp) {
      var ag, len10, news, ref10;
      localStorage["newsCommit"] = nc;
      ref10 = resp.responseText.split("<hr>");
      for (ag = 0, len10 = ref10.length; ag < len10; ag++) {
        news = ref10[ag];
        document.getElementById("newsContent").appendChild(element("div", "newsItem", news));
      }
      document.getElementById("newsBackground").style.display = "block";
      return document.getElementById("news").classList.add("active");
    }, function(err) {
      if (onfail != null) {
        return onfail();
      }
    });
  };
  if (last !== nc && !firstTime) {
    window.getNews();
  }
  if (last == null) {
    return localStorage["newsCommit"] = nc;
  }
}, function(err) {
  return console.log("Could not access Github. Here's the error:", err);
});

closeNews = function() {
  document.getElementById("news").classList.remove("active");
  return setTimeout(function() {
    return document.getElementById("newsBackground").style.display = "none";
  }, 350);
};

document.getElementById("newsOk").addEventListener("click", closeNews);

document.getElementById("newsBackground").addEventListener("click", closeNews);

document.getElementById("newsB").addEventListener("click", function() {
  var dispNews;
  document.getElementById("sideBackground").click();
  dispNews = function() {
    document.getElementById("newsBackground").style.display = "block";
    return document.getElementById("news").classList.add("active");
  };
  if (document.getElementById("newsContent").childNodes.length === 0) {
    if (typeof getNews !== "undefined" && getNews !== null) {
      return getNews(dispNews);
    } else {
      return dispNews();
    }
  } else {
    return dispNews();
  }
});
