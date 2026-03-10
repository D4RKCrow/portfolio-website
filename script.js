// ===================== DARK MODE + PARTICLES =====================

function initParticles(isDark) {
    if (window.pJSDom && window.pJSDom.length > 0) {
        window.pJSDom[0].pJS.fn.vendors.destroypJS();
        window.pJSDom = [];
    }

    const starColor = isDark ? '#ffffff' : '#4466ff';

    particlesJS("particles-js", {
        particles: {
            number: { value: 80 },
            color: { value: starColor },
            opacity: { value: 0.8 },
            size: { value: 5 },
            move: { enable: true, speed: 0.8 },
            line_linked: {
                enable: true,
                color: starColor,
                opacity: 0.3,
                distance: 150
            },
            shape: { type: "circle" }
        },
        interactivity: {
            events: {
                onhover: { enable: false },
                onclick: { enable: false }
            }
        }
    });

    setTimeout(() => {
        const pJS = window.pJSDom?.[0]?.pJS;
        if (!pJS) return;

        function draw4Star(ctx, x, y, r, color) {
            ctx.save();
            ctx.globalAlpha = 0.9;
            ctx.fillStyle = color;
            ctx.beginPath();
            for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI) / 4 - Math.PI / 2;
                const rad = i % 2 === 0 ? r : r * 0.3;
                const px = x + rad * Math.cos(angle);
                const py = y + rad * Math.sin(angle);
                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        const originalUpdate = pJS.fn.vendors.update.bind(pJS);
        pJS.fn.vendors.update = function () {
            originalUpdate();
            this.particles.array.forEach(p => {
                draw4Star(this.canvas.ctx, p.x, p.y, p.radius * 1.5, starColor);
            });
        };
    }, 300);
}

// ===================== APPLY THEME =====================

function applyTheme(isDark) {
    const root = document.documentElement;

    if (isDark) {
        document.body.classList.add("dark");
        document.body.style.background = "#000010";
        document.body.style.color = "#e8e8ff";
        root.style.setProperty('--bg', '#000010');
        root.style.setProperty('--text', '#e8e8ff');
        root.style.setProperty('--glass', 'rgba(255,255,255,0.05)');
        root.style.setProperty('--accent', '#00f7ff');
        root.style.setProperty('--accent2', '#7b2fff');
    } else {
        document.body.classList.remove("dark");
        document.body.style.background = "#f0f4ff";
        document.body.style.color = "#0a0a1a";
        root.style.setProperty('--bg', '#f0f4ff');
        root.style.setProperty('--text', '#0a0a1a');
        root.style.setProperty('--glass', 'rgba(0,0,0,0.05)');
        root.style.setProperty('--accent', '#0055cc');
        root.style.setProperty('--accent2', '#6600cc');
    }

    localStorage.setItem("theme", isDark ? "dark" : "light");
    initParticles(isDark);
}

// ===================== INIT ON PAGE LOAD =====================

document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("themeToggle");

    if (!toggleBtn) {
        console.error("themeToggle button not found!");
        return;
    }

    const isDarkOnLoad = localStorage.getItem("theme") === "dark";
    toggleBtn.textContent = isDarkOnLoad ? "☀️" : "🌙";
    applyTheme(isDarkOnLoad);

    toggleBtn.addEventListener("click", () => {
        const isDark = !document.body.classList.contains("dark");
        toggleBtn.textContent = isDark ? "☀️" : "🌙";
        applyTheme(isDark);
    });
});


// ===================== TYPING EFFECT =====================
const roles = ["Computer Science", "BSCS Student", "CETA"];
let roleIndex = 0;
let charIndex = 0;

function typeEffect() {
    const typingElement = document.getElementById("typing");
    if (!typingElement) return;
    if (charIndex < roles[roleIndex].length) {
        typingElement.textContent += roles[roleIndex].charAt(charIndex);
        charIndex++;
        setTimeout(typeEffect, 100);
    } else {
        setTimeout(eraseEffect, 1500);
    }
}

function eraseEffect() {
    const typingElement = document.getElementById("typing");
    if (!typingElement) return;
    if (charIndex > 0) {
        typingElement.textContent = roles[roleIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(eraseEffect, 50);
    } else {
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeEffect, 500);
    }
}

typeEffect();


// ===================== GALLERY =====================
const gallery = document.querySelector(".gallery");
const leftArrow = document.querySelector(".arrow.left");
const rightArrow = document.querySelector(".arrow.right");
let index = 0;

function getSlides() {
    return document.querySelectorAll(".gallery-slide-wrapper");
}

function getWidth() {
    const slides = getSlides();
    return slides.length > 0 ? slides[0].offsetWidth : 600;
}

function updateGallery() {
    if (gallery) gallery.style.transform = `translateX(${-index * getWidth()}px)`;
}

if (rightArrow) rightArrow.addEventListener("click", () => {
    index = (index + 1) % getSlides().length;
    updateGallery();
    resetAutoSlide();
});

if (leftArrow) leftArrow.addEventListener("click", () => {
    index = (index - 1 + getSlides().length) % getSlides().length;
    updateGallery();
    resetAutoSlide();
});

let autoSlide = setInterval(() => {
    if (getSlides().length > 0) {
        index = (index + 1) % getSlides().length;
        updateGallery();
    }
}, 5000);

function resetAutoSlide() {
    clearInterval(autoSlide);
    autoSlide = setInterval(() => {
        if (getSlides().length > 0) {
            index = (index + 1) % getSlides().length;
            updateGallery();
        }
    }, 5000);
}

// Add a fresh empty slot at the end of the gallery
function addEmptySlot() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("gallery-slide-wrapper", "empty-slide");
    wrapper.innerHTML = `
        <div class="empty-slot">
            <label class="slot-upload-label">
                <span class="slot-plus">+</span>
                <span class="slot-text">Click to add image</span>
                <input type="file" accept="image/*" hidden>
            </label>
        </div>
    `;
    gallery.appendChild(wrapper);
    setupSlotUpload(wrapper);
}

// Handle upload for an empty slot — fills it and spawns a new empty slot
function setupSlotUpload(wrapper) {
    const input = wrapper.querySelector("input[type='file']");
    if (!input) return;

    input.addEventListener("change", function () {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            // Replace empty slot with filled image + delete button
            wrapper.classList.remove("empty-slide");
            wrapper.innerHTML = `
                <img src="${e.target.result}" alt="Gallery Image">
                <div class="gallery-slide-btns">
                    <button class="slide-delete-btn">Delete</button>
                </div>
            `;

            // Click image to open modal
            const img = wrapper.querySelector("img");
            img.addEventListener("click", () => {
                if (modal && modalImg) {
                    modal.style.display = "block";
                    modalImg.src = img.src;
                }
            });

            // Delete button — remove slide and clamp index
            const delBtn = wrapper.querySelector(".slide-delete-btn");
            delBtn.addEventListener("click", () => {
                const slides = getSlides();
                if (index >= slides.length - 1) index = Math.max(0, slides.length - 2);
                wrapper.remove();
                updateGallery();
            });

            // Always spawn a new empty slot after filling one
            addEmptySlot();

            // Jump to the newly added empty slot
            index = getSlides().length - 1;
            updateGallery();
            resetAutoSlide();
        };
        reader.readAsDataURL(file);
        this.value = "";
    });
}

// Init: setup the first empty slot already in the HTML
const firstSlot = document.querySelector(".gallery-slide-wrapper.empty-slide");
if (firstSlot) setupSlotUpload(firstSlot);


// ===================== LOADER =====================
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (loader) {
        loader.style.opacity = "0";
        setTimeout(() => loader.style.display = "none", 500);
    }
});


// ===================== SCROLL ANIMATIONS =====================
const navSections = [
    { id: "about",               href: "#about" },
    { id: "main-content",        href: "#experience" },
    { id: "skills",              href: "#skills" },
    { id: "cs-projects",         href: "#cs-projects" },
    { id: "gallery",             href: "#gallery" },
    { id: "functional-gallery",  href: "#functional-gallery" }
];

window.addEventListener("scroll", () => {
    document.querySelectorAll(".section").forEach(sec => {
        if (sec.getBoundingClientRect().top < window.innerHeight - 100) {
            sec.classList.add("show");
        }
    });

    const scrollY = window.scrollY;
    const windowH = window.innerHeight;
    const bodyH = document.body.scrollHeight;

    let currentNavHref = "";

    if (scrollY + windowH >= bodyH - 80) {
        currentNavHref = "#functional-gallery";
    } else {
        navSections.forEach(({ id, href }) => {
            const el = document.getElementById(id);
            if (!el) return;
            const sectionTop = el.getBoundingClientRect().top + scrollY;
            if (scrollY >= sectionTop - 200) {
                currentNavHref = href;
            }
        });
    }

    document.querySelectorAll("nav a").forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === currentNavHref) {
            link.classList.add("active");
        }
    });
});


// ===================== CURSOR GLOW =====================
const cursorGlow = document.querySelector(".cursor-glow");
if (cursorGlow) {
    document.addEventListener("mousemove", (e) => {
        cursorGlow.style.left = e.clientX + "px";
        cursorGlow.style.top = e.clientY + "px";
        cursorGlow.classList.add("visible");
    });
}


// ===================== IMAGE MODAL =====================
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");
const closeBtn = document.querySelector(".close");

if (closeBtn) closeBtn.onclick = () => modal.style.display = "none";
if (modal) modal.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };


// ===================== GALLERY DRAG & SWIPE =====================
let startX = 0;
let isDragging = false;

if (gallery) {
    gallery.addEventListener("mousedown", (e) => { isDragging = true; startX = e.pageX; });
    gallery.addEventListener("mouseup", (e) => {
        if (!isDragging) return;
        const diff = e.pageX - startX;
        if (diff > 50) index = (index - 1 + getSlides().length) % getSlides().length;
        else if (diff < -50) index = (index + 1) % getSlides().length;
        updateGallery();
        resetAutoSlide();
        isDragging = false;
    });
    gallery.addEventListener("mouseleave", () => { isDragging = false; });
    gallery.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; });
    gallery.addEventListener("touchend", (e) => {
        const diff = e.changedTouches[0].clientX - startX;
        if (diff > 50) index = (index - 1 + getSlides().length) % getSlides().length;
        else if (diff < -50) index = (index + 1) % getSlides().length;
        updateGallery();
        resetAutoSlide();
    });
}


// ===================== NAV SMOOTH SCROLL =====================
document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href").replace("#", "");
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
            const headerHeight = document.querySelector("header")?.offsetHeight || 70;
            const top = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
            window.scrollTo({ top, behavior: "smooth" });
            setTimeout(() => window.dispatchEvent(new Event("scroll")), 600);
        }
    });
});


// ===================== CHAT BOX =====================
const chatBtn = document.querySelector(".chat-button");
const chatBox = document.querySelector(".chat-box");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.querySelector(".chat-messages");

if (chatBtn && chatBox) {
    chatBtn.addEventListener("click", () => {
        chatBox.style.display = chatBox.style.display === "flex" ? "none" : "flex";
    });
}

if (chatInput && chatMessages) {
    chatInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter" && chatInput.value.trim()) {
            appendMessage("You: " + chatInput.value);
            chatInput.value = "";
            setTimeout(() => appendMessage("AI: I am Kenji's AI assistant 🤖"), 500);
        }
    });
}

function appendMessage(msg) {
    if (!chatMessages) return;
    const div = document.createElement("div");
    div.textContent = msg;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


// ===================== PROFILE IMAGE =====================
document.addEventListener("DOMContentLoaded", function () {
    const uploadInput = document.getElementById("uploadProfile");
    const profilePreview = document.getElementById("profilePreview");
    const deleteBtn = document.getElementById("deleteProfile");

    if (!uploadInput || !profilePreview || !deleteBtn) return;

    // Loads saved upload from localStorage, otherwise shows default profile image
    const savedImage = localStorage.getItem("profileImage");
    profilePreview.src = savedImage || "patrick.jpg";

    uploadInput.addEventListener("change", function () {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            profilePreview.src = e.target.result;
            localStorage.setItem("profileImage", e.target.result);
        };
        reader.readAsDataURL(file);
    });

    deleteBtn.addEventListener("click", () => {
        // Clears image visually — refresh restores patrick_profile.jpg
        profilePreview.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
        localStorage.removeItem("profileImage");
    });

    const profileModal = document.getElementById("imageModal");
    const profileModalImg = document.getElementById("modalImg");
    const closeModal = document.getElementById("closeModal");

    if (profileModal && profileModalImg && closeModal) {
        profilePreview.addEventListener("click", () => {
            profileModal.style.display = "block";
            profileModalImg.src = profilePreview.src;
        });
        closeModal.addEventListener("click", () => profileModal.style.display = "none");
        window.addEventListener("click", (e) => {
            if (e.target === profileModal) profileModal.style.display = "none";
        });
    }
});


// ===================== PROJECT IMAGE UPLOADS =====================
function setupImageUpload(inputId, containerId) {
    const input = document.getElementById(inputId);
    const container = document.getElementById(containerId);
    if (!input || !container) return;

    input.addEventListener("change", function () {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const imgWrapper = document.createElement("div");
            imgWrapper.classList.add("image-wrapper");
            const img = document.createElement("img");
            img.src = e.target.result;
            const delBtn = document.createElement("button");
            delBtn.textContent = "Delete";
            delBtn.classList.add("delete-btn");
            delBtn.onclick = () => imgWrapper.remove();
            imgWrapper.appendChild(img);
            imgWrapper.appendChild(delBtn);
            const uploaderLabel = container.querySelector("label.grid-uploader");
            if (uploaderLabel) {
                container.insertBefore(imgWrapper, uploaderLabel);
            } else {
                container.appendChild(imgWrapper);
            }
        };
        reader.readAsDataURL(file);
    });
}

setupImageUpload("uploadSaas", "saasImages");
setupImageUpload("uploadWorkout", "workoutImages");
setupImageUpload("uploadCert", "certImages");


// ===================== FUNCTIONAL GALLERY — VIDEO UPLOAD =====================
(function setupVideoUpload() {
    const input = document.getElementById("uploadFuncVideo");
    const container = document.getElementById("funcVideoGrid");
    if (!input || !container) return;

    input.addEventListener("change", function () {
        const file = this.files[0];
        if (!file || !file.type.startsWith("video/")) return;

        const url = URL.createObjectURL(file);

        const wrapper = document.createElement("div");
        wrapper.classList.add("video-wrapper");

        const video = document.createElement("video");
        video.src = url;
        video.controls = true;
        video.preload = "metadata";

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.classList.add("delete-btn");
        delBtn.onclick = () => {
            URL.revokeObjectURL(url);
            wrapper.remove();
        };

        wrapper.appendChild(video);
        wrapper.appendChild(delBtn);

        const uploaderLabel = container.querySelector("label.grid-uploader");
        if (uploaderLabel) {
            container.insertBefore(wrapper, uploaderLabel);
        } else {
            container.appendChild(wrapper);
        }

        this.value = "";
    });
})();
// ===================== CREATE PROJECT — CERTIFICATION =====================
(function setupCreateProject() {
    const modal     = document.getElementById("createProjectModal");
    const cancelBtn = document.getElementById("cpCancel");
    const createBtn = document.getElementById("cpCreate");
    const nameInput = document.getElementById("cpName");
    const descInput = document.getElementById("cpDesc");
    if (!modal) return;

    let projectCount = 0;
    let activeListEl = null;

    document.querySelectorAll(".open-cp-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            activeListEl = document.getElementById(btn.dataset.list);
            nameInput.value = "";
            descInput.value = "";
            modal.style.display = "flex";
            document.body.classList.add("modal-open");
            nameInput.focus();
        });
    });

    function closeModal() {
        modal.style.display = "none";
        document.body.classList.remove("modal-open");
    }

    cancelBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

    createBtn.addEventListener("click", () => {
        const name = nameInput.value.trim();
        const desc = descInput.value.trim();
        if (!name) { nameInput.focus(); return; }
        closeModal();
        if (activeListEl) buildProject(name, desc, activeListEl);
    });

    function buildProject(name, desc, listEl) {
        projectCount++;
        const uid = "cp-" + projectCount;
        const card = document.createElement("div");
        card.classList.add("cp-card");
        card.id = uid;

        const header = document.createElement("div");
        header.classList.add("cp-card-header");
        const titleWrap = document.createElement("div");
        const h2 = document.createElement("h2");
        h2.classList.add("cp-card-title");
        h2.textContent = name;
        const underline = document.createElement("div");
        underline.classList.add("cp-card-underline");
        titleWrap.appendChild(h2);
        titleWrap.appendChild(underline);
        const delCardBtn = document.createElement("button");
        delCardBtn.textContent = "Delete Project";
        delCardBtn.classList.add("cp-delete-card-btn");
        delCardBtn.addEventListener("click", () => card.remove());
        header.appendChild(titleWrap);
        header.appendChild(delCardBtn);

        const descEl = document.createElement("p");
        descEl.classList.add("cp-card-desc");
        descEl.textContent = desc || "";

        const imgInputId = uid + "-img";
        const imgGrid = document.createElement("div");
        imgGrid.classList.add("cp-img-grid");
        const addLabel = document.createElement("label");
        addLabel.setAttribute("for", imgInputId);
        addLabel.classList.add("gallery-upload-label", "grid-uploader");
        addLabel.innerHTML = `<span class="label-title">Add Image</span><span class="label-sub">Click to add image</span>`;
        const imgInput = document.createElement("input");
        imgInput.type = "file";
        imgInput.id = imgInputId;
        imgInput.accept = "image/*";
        imgInput.hidden = true;
        addLabel.appendChild(imgInput);
        imgGrid.appendChild(addLabel);

        imgInput.addEventListener("change", function () {
            const file = this.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                const wrapper = document.createElement("div");
                wrapper.classList.add("gallery-image-wrapper");
                const img = document.createElement("img");
                img.src = e.target.result;
                img.style.cssText = "width:100%;height:100%;object-fit:contain;object-position:center;position:absolute;top:0;left:0;border-radius:0;cursor:pointer;";
                img.addEventListener("click", () => {
                    const lbModal = document.getElementById("imageModal");
                    const lbImg = document.getElementById("modalImg");
                    if (lbModal && lbImg) { lbImg.src = img.src; lbModal.style.display = "block"; }
                });
                const delBtn = document.createElement("button");
                delBtn.textContent = "Delete";
                delBtn.classList.add("delete-btn");
                delBtn.onclick = () => wrapper.remove();
                wrapper.appendChild(img);
                wrapper.appendChild(delBtn);
                imgGrid.insertBefore(wrapper, addLabel);
            };
            reader.readAsDataURL(file);
            this.value = "";
        });

        card.appendChild(header);
        if (desc) card.appendChild(descEl);
        card.appendChild(imgGrid);
        listEl.appendChild(card);
        setTimeout(() => card.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
})();
