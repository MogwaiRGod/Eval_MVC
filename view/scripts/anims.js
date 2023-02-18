/*
 * FONCTIONS
 */

// fonction appliquant une animation à un élément HTML
function setAnim(item, anim, duration="0.2s", type="forwards") {
    return item.style.animation = `${anim} ${duration} ${type}`;
}



/*
 * PARTIES RECURRENTES
 */

/* 
 * ANIMATIONS DE LA NAV
 */

const containerLogo = document.getElementById("nav-logo");
const logo = document.getElementById("icon-nav-logo");
const textLogo = document.getElementById('nav-link-logo');

// LOGO
// survol du logo
containerLogo.addEventListener('mouseover', () => {
    logo.src = "../imgs/music_hover.svg";
    setAnim(logo, 'hoverLogo');
    setAnim(textLogo, 'hoverLogoText');
    return;
});

// à l'arrêt du survol
containerLogo.addEventListener('mouseleave', () => {
    logo.src = "../imgs/music.svg";
    setAnim(logo, 'leaveLogo');
    setAnim(textLogo, 'leaveLogoText');
    return;
});

// icônes
document.querySelectorAll(".hover-nav").forEach(item => {
    // au survol
    item.addEventListener('mouseover', () => {
        // on change la source de l'image (pour avoir celle dédiée au le survol)
        item.setAttribute("src", item.getAttribute("src").substring(0, item.getAttribute("src").length-4) + '_hover.svg');
        return;
    });

    // à l'arrêt du survol
    item.addEventListener('mouseleave', () => {
        // on change la source de l'image (pour avoir celle dédiée au le survol)
        item.setAttribute("src",  item.getAttribute("src").substring(0, item.getAttribute("src").length-10) + '.svg');
        return;
    });
});



/* 
 * ANIMATIONS DE LA SECTION D'APPS 
 */

// je ferai ça si j'ai le temps
// document.querySelectorAll(".app").forEach(item => {

// });


