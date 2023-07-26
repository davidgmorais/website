import { decryptText, encryptText } from "./cryptoUtils.js";

const historyObserver = new IntersectionObserver((e) => {
    e.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add("show")
        }
    })
}, {threshold: 0.05});
const menuObserver = new IntersectionObserver((e) => {
    e.forEach(e => {
        if (e.isIntersecting) {
            let anchor = $("#anchor_" + e.target.id);
            $(".nav-link.active").removeClass("active");
            anchor.addClass("active");        
        }
    })
}, {threshold: 0.35});


$(document).ready(function () {
    let brandTimerId;
    $(".sensitive").each((i, text) => {
        let cipher = encryptText(text.innerHTML)
        text.innerHTML = cipher;
        initDecrypt($(text));
    })

    $('.slide-in-bottom').each((index, elem) => historyObserver.observe(elem));
    $('section').each((index, elem) => menuObserver.observe(elem));

    const onBrandReset = () => {
        clearInterval(brandTimerId);
        brandTimerId = null;
        $('.navbar-brand').text("DM");
    }

    const onBrandDecryptAnimation = () => {
        if (window.scrollY == 0) {
            onBrandReset();
            return;
        }; 

        let currentBrand = $('.navbar-brand').text()
        let newBrand = "";
        for (let i=0; i<currentBrand.length; i+=1) {
            const ch = currentBrand.toLowerCase().charCodeAt(i);
            const step = Math.floor(27*Math.random() + 96);
            const next = String.fromCharCode((((ch-97) + step) % (122-96)) + 97);
            newBrand += (step % 2 == 0) ? next : next.toUpperCase();
        }
        $('.navbar-brand').text(newBrand);
    }

    $('.navbar-brand').on({
        mouseenter: function () {
            if (!brandTimerId) brandTimerId = setInterval(onBrandDecryptAnimation, 50);
        },
        mouseleave: function () {
            onBrandReset();
        }
    });

});

const animateDecrypt = (element, text) => {
    let state = element.text();
    let intervalTimer;
    let timeout;

    intervalTimer = setInterval(function(element, text) {
        let newState = "";

        for (let i=0; i<text.length; i+=1) {
            const target = text.charAt(i);
            const cipherCh = state.toLowerCase().charCodeAt(i);
            const plainCh = text.toLowerCase().charCodeAt(i);

            if (state.charAt(i).toLowerCase() === target.toLowerCase() || target === " ") {
                newState += target;
            } else {
                const step = (Math.abs(cipherCh-plainCh) % 2) ? 1 : 2;
                const next = (((cipherCh-97) + step) % (122-96)) + 97;
                newState += String.fromCharCode(next);
            }
        }
        
        if (newState === text.slice(0, newState.length)) {
            clearInterval(intervalTimer);
            clearTimeout(timeout);
            element.html(text);
        }
        state = newState;
        element.text(state);
    }, 50, element, text);

    timeout = setTimeout(function(text) {
        clearInterval(intervalTimer);
        element.html(text);
        console.log("timeout")
    }, 3000, text);
} 

const initDecrypt = (element) => {
    const decrypted = decryptText(element.text());
    animateDecrypt(element, decrypted)
}
