const takeScreenshot = async function(page, nr) {
    const path = "screenshots/" + nr + ".png";
    console.log("Taking screenshot: " + path);
    return await page.screenshot({ path: path });
}

const isAnyParentNotVisible = async function(page, elementHandle) {
    let parent = await elementHandle.evaluateHandle((node) => node.parentElement);
    while (parent) {
        const isVisible = await page.evaluate((element) => {
            const { display, visibility } = getComputedStyle(element);
            return display !== 'none' && visibility !== 'hidden';
        }, parent);
        if (!isVisible) {
            return true;
        }
        parent = await parent.evaluateHandle((node) => node.parentElement);
    }
    return false;
}

const isElementClickable = async function(page, elementHandle) {
    // get size of element
    const size = await elementHandle.boundingBox();
    console.log({size});
    if(!size) return false;
    return true;
    // console.log("here");
    // const [display, visibility, isDisabled] = await page.evaluate((element) => {
    //     const { display, visibility } = getComputedStyle(element);
    //     const isDisabled = element.hasAttribute('disabled');
    //     return [display, visibility, isDisabled];
    // }, elementHandle);
    // console.log("isElementClickable: " + display + " " + visibility + " " + isDisabled);
    // if(!(await page.evaluate(async (element) => {
    //     const { display, visibility } = getComputedStyle(element);
    //     const isDisabled = element.hasAttribute('disabled');
    //     if(display == 'none' || visibility == 'hidden' || isDisabled) return false;
    //     return true;
    // }, elementHandle))) return false;
    // let parent = await elementHandle.evaluateHandle((node) => node.parentElement);
    // while (parent) {
    //     const isVisible = await page.evaluate((element) => {
    //         const { display, visibility } = getComputedStyle(element);
    //         return display !== 'none' && visibility !== 'hidden';
    //     }, parent);
    //     if (!isVisible) {
    //         return true;
    //     }
    //     parent = await parent.evaluateHandle((node) => node.parentElement);
    // }
    // return false;
}


module.exports = { takeScreenshot, isElementClickable };

