/* ============================================================
   DEBUG.JS — Lightweight Debug Logger
   Safe, scraper‑free, no external requests.
============================================================ */

const DEBUG = false; // Set to true to enable console logs

function log(...args) {
    if (DEBUG) console.log("[ManhwaApp]", ...args);
}

function warn(...args) {
    if (DEBUG) console.warn("[ManhwaApp]", ...args);
}

function error(...args) {
    if (DEBUG) console.error("[ManhwaApp]", ...args);
}

window.debug = { log, warn, error };
