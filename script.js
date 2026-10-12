// Savora template interactions
(function () {
  var nav = document.getElementById("topnav");
  var burger = document.getElementById("hamburger");
  var mobile = document.getElementById("mobilemenu");

  // Sticky nav shadow
  function onScroll() {
    if (window.scrollY > 8) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  function closeMobile() {
    mobile.classList.remove("open");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  }
  burger.addEventListener("click", function () {
    var open = mobile.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });
  mobile.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMobile);
  });

  // Smooth scroll with sticky offset
  document.querySelectorAll("[data-scroll]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (!id || id.charAt(0) !== "#") return;
      var target = document.querySelector(id === "#top" ? "main" : id);
      if (!target) return;
      e.preventDefault();
      var y = target.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top: y < 0 ? 0 : y, behavior: "smooth" });
      closeMobile();
    });
  });

  // Active nav link
  var sections = ["menu", "story", "gallery", "reviews", "visit"];
  var navLinks = document.querySelectorAll(".links a");
  function setActive() {
    var current = "";
    sections.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var r = el.getBoundingClientRect();
      if (r.top <= 140) current = id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  }
  window.addEventListener("scroll", setActive, { passive: true });
  setActive();

  // Menu tabs
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  var panels = Array.prototype.slice.call(document.querySelectorAll(".menupanel"));
  var glow = document.getElementById("tabglow");

  function moveGlow(btn) {
    if (!glow || !btn) return;
    glow.style.left = btn.offsetLeft + "px";
    glow.style.width = btn.offsetWidth + "px";
  }
  function selectTab(name) {
    tabs.forEach(function (t) {
      var on = t.getAttribute("data-tab") === name;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    panels.forEach(function (p) {
      var on = p.getAttribute("data-panel") === name;
      if (on) {
        p.hidden = false;
        p.classList.remove("active");
        void p.offsetWidth;
        p.classList.add("active");
      } else {
        p.hidden = true;
        p.classList.remove("active");
      }
    });
    var active = document.querySelector('.tab[data-tab="' + name + '"]');
    moveGlow(active);
  }
  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      selectTab(t.getAttribute("data-tab"));
    });
  });
  window.addEventListener("resize", function () {
    moveGlow(document.querySelector(".tab.active"));
  });
  moveGlow(document.querySelector(".tab.active"));

  // Scroll reveal
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("visible");
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach(function (el) {
    io.observe(el);
  });

  // Reservation form
  var form = document.getElementById("reserveform");
  var err = document.getElementById("formerror");
  var success = document.getElementById("success");
  var successText = document.getElementById("successtext");
  var again = document.getElementById("againbtn");
  var dateInput = document.getElementById("fdate");

  if (dateInput) {
    var today = new Date();
    var iso = today.toISOString().split("T")[0];
    dateInput.min = iso;
  }

  function showError(msg, field) {
    err.textContent = msg;
    err.hidden = false;
    if (field) {
      field.classList.add("invalid");
      field.focus();
    }
  }
  function clearInvalid() {
    err.hidden = true;
    form.querySelectorAll(".invalid").forEach(function (f) {
      f.classList.remove("invalid");
    });
  }
  form.querySelectorAll("input, select").forEach(function (f) {
    f.addEventListener("input", function () {
      f.classList.remove("invalid");
      if (!form.querySelector(".invalid")) err.hidden = true;
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearInvalid();
    var name = document.getElementById("fname");
    var phone = document.getElementById("fphone");
    var email = document.getElementById("femail");
    var time = document.getElementById("ftime");
    var guests = document.getElementById("fguests");

    if (name.value.trim().length < 2) {
      showError("Please enter your full name so we can hold the table.", name);
      return;
    }
    var digits = phone.value.replace(/\D/g, "");
    if (digits.length < 7) {
      showError("Please enter a valid phone number so we can confirm.", phone);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      showError("Please enter a valid email for the confirmation.", email);
      return;
    }
    if (!dateInput.value) {
      showError("Please pick a date for your visit.", dateInput);
      return;
    }
    var picked = new Date(dateInput.value + "T12:00:00");
    var start = new Date();
    start.setHours(0, 0, 0, 0);
    if (picked < start) {
      showError("That date has passed. Please choose a future date.", dateInput);
      return;
    }
    if (!time.value) {
      showError("Please choose an arrival time.", time);
      return;
    }
    if (!guests.value) {
      showError("Please tell us how many guests are coming.", guests);
      return;
    }
    var nice = picked.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric"
    });
    successText.textContent =
      "Thanks " + name.value.trim() + ". Table for " + guests.value +
      " on " + nice + " at " + time.value + ". We will confirm shortly.";
    form.hidden = true;
    success.hidden = false;
  });

  again.addEventListener("click", function () {
    form.reset();
    form.hidden = false;
    success.hidden = true;
  });

  // Footer year
  document.getElementById("year").textContent = new Date().getFullYear();
})();
