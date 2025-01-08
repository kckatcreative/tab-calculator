document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".tab_1_wrap").forEach((tabWrap, componentIndex) => {
    if (tabWrap.dataset.scriptInitialized) return;
    tabWrap.dataset.scriptInitialized = "true";
   
    const allowLoop = tabWrap.getAttribute("data-allow-loop") === "true",
    defaultTab = +tabWrap.getAttribute("data-default-tab") || 0,
    buttonList = tabWrap.querySelector(".tab_1_button_list"),
    buttonItems = tabWrap.querySelectorAll(".tab_1_button_item"),
    panelList = tabWrap.querySelector(".tab_1_content_list"),
    panelItems = tabWrap.querySelectorAll(".tab_1_content_item"),
    previousButton = tabWrap.querySelector(".tab_1_control_button.is-previous"),
    nextButton = tabWrap.querySelector(".tab_1_control_button.is-next");
   
    if (!buttonList || !panelList || !buttonItems.length || !panelItems.length) {
    console.warn("Missing elements in:", tabWrap);
    return;
    }
   
    buttonList.setAttribute("role", "tablist");
    buttonItems.forEach((btn) => btn.setAttribute("role", "tab"));
    panelItems.forEach((panel) => panel.setAttribute("role", "tabpanel"));
   
    let activeIndex = defaultTab;
    const makeActive = (index, focus = true) => {
    activeIndex = index;
    buttonItems.forEach((btn, i) => {
    btn.classList.toggle("is-active", i === index);
    btn.setAttribute("aria-selected", i === index ? "true" : "false");
    btn.setAttribute("tabindex", i === index ? "0" : "-1");
    });
    panelItems.forEach((panel, i) => panel.classList.toggle("is-active", i === index));
    if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
    if (nextButton) nextButton.disabled = index === buttonItems.length - 1 && !allowLoop;
    if (previousButton) previousButton.disabled = index === 0 && !allowLoop;
    if (focus) buttonItems[index].focus();
    };
   
    makeActive(defaultTab, false);
   
    const updateIndex = (delta) => makeActive((activeIndex + delta + buttonItems.length) % buttonItems.length);
    nextButton?.addEventListener("click", () => updateIndex(1));
    previousButton?.addEventListener("click", () => updateIndex(-1));
   
    buttonItems.forEach((btn, index) => {
    btn.setAttribute("id", "tab_1_button_" + componentIndex + "_" + index);
    btn.setAttribute("aria-controls", "tab_1_panel_" + componentIndex + "_" + index);
    panelItems[index].setAttribute("id", "tab_1_panel_" + componentIndex + "_" + index);
    panelItems[index].setAttribute("aria-labelledby", btn.id);
    btn.addEventListener("click", () => makeActive(index));
    btn.addEventListener("keydown", (e) => {
    if (["ArrowRight", "ArrowDown"].includes(e.key)) updateIndex(1);
    else if (["ArrowLeft", "ArrowUp"].includes(e.key)) updateIndex(-1);
    });
    });
    });
   });