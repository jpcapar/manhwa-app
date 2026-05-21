// Toggle debug mode
const DEBUG_MODE = true;

function debugLog(data) {
    if (!DEBUG_MODE) return;

    console.log("🔍 DEBUG:", data);

    let panel = document.getElementById("debugPanel");
    if (!panel) {
        panel = document.createElement("div");
        panel.id = "debugPanel";
        panel.style.position = "fixed";
        panel.style.bottom = "0";
        panel.style.right = "0";
        panel.style.width = "340px";
        panel.style.maxHeight = "60vh";
        panel.style.overflowY = "auto";
        panel.style.background = "rgba(0,0,0,0.85)";
        panel.style.color = "#fff";
        panel.style.fontSize = "12px";
        panel.style.padding = "12px";
        panel.style.borderTopLeftRadius = "10px";
        panel.style.zIndex = "999999";
        panel.style.boxShadow = "0 0 12px rgba(0,0,0,0.6)";
        document.body.appendChild(panel);
    }

    const entry = document.createElement("div");
    entry.style.marginBottom = "10px";
    entry.style.borderBottom = "1px solid #333";
    entry.style.paddingBottom = "8px";

    entry.innerHTML = `
        <strong>${new Date().toLocaleTimeString()}</strong><br>
        <pre style="white-space:pre-wrap;">${JSON.stringify(data, null, 2)}</pre>
    `;

    panel.appendChild(entry);
}
