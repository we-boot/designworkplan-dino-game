// Source code taken from https://codepen.io/designworkplan/pen/gOzwjXQ

class Carousel {
    constructor(container, autoplay, playspeed, dots) {
        this.container = container;
        this.childs = container.childElementCount;
        this.toShow = 3;
        this.autoplay = autoplay;
        this.playSpeed = playspeed;
        this.dots = dots;
        this.cards = [];
    }

    init() {
        //reset interval si actif quelque part
        window.clearInterval(this.interval);
        // Active les points si true
        this.dots == true ? this.initDots() : "";
        this.getCards();

        // Affiche uniquement le nombre de cartes définies
        this.cards.forEach((card) => {
            const index = this.cards.indexOf(card);
            if (index < this.toShow) {
                card.classList.toggle("hidden");
            }

            // Défini les tailles des cartes
            this.setSize(index, card);
            card.id = `card-${index}`;
        });

        // Active l'autoplay si true
        if (this.autoplay == true) {
            this.autoPlay();
        }
    }

    update(id = null, forced = false, index = null) {
        // Mets a jour les cartes quand boutons pressés
        if (id == "prev") {
            const lastEl = this.container.children[this.childs - 1];
            this.container.insertAdjacentElement("afterbegin", lastEl);
        }
        if (id == "next") {
            const firstEl = this.container.children[0];
            this.container.insertAdjacentElement("beforeend", firstEl);
        }

        this.getCards();

        if (forced == true && index != null) {
            let arr = [];
            let items = document.createDocumentFragment();

            arr[0] = index == 0 ? this.cards.length - 1 : index - 1;
            arr[1] = index;
            arr[2] = index == this.cards.length - 1 ? 0 : index + 1;
            for (let i = 3; i < this.cards.length; i++) {
                arr[i] = arr[i - 1] + 1 > this.cards.length - 1 ? 0 : arr[i - 1] + 1;
            }

            for (let j = 0; j < arr.length; j++) {
                let element = this.cards.filter((card) => parseInt(card.id.split("-")[1]) == arr[j]);
                items.append(element[0]);
            }

            this.container.innerHTML = null;
            this.container.append(items);
        }

        // Reset les classes et défini lequelles doivent être affichées
        this.cards.forEach((card) => {
            card.classList.remove("hidden", "left", "selected", "right");

            if (this.cards.indexOf(card) > this.toShow - 1) {
                if (!card.classList.contains("hidden")) {
                    card.classList.add("hidden");
                }
            }

            // Défini la taille des cartes et le dot à activer
            this.setSize(this.cards.indexOf(card), card);
            this.updateDots();
        });
    }

    getCards() {
        // Récupère les cartes dans le bon ordre
        this.cards = [];
        for (let i = 0; i < this.childs; i++) {
            this.cards.push(this.container.children[i]);
        }
    }

    setSize(index, card) {
        // Assigne la bonne classe en fonction de la position
        switch (index) {
            case 0:
                card.classList.add("left");
                break;
            case 1:
                card.classList.add("selected");
                break;
            case 2:
                card.classList.add("right");
                break;
        }
    }

    initDots() {
        // Crée les dots et
        const dots = document.getElementById("carousel-dots");

        this.getCards();
        this.cards.forEach((card) => {
            const dot = document.createElement("div");
            dot.id = `dot-${this.cards.indexOf(card)}`;

            if (this.cards.indexOf(card) == 1) {
                dot.classList.add("active-dot");
            }

            dot.classList.add("dot");
            dots.insertAdjacentElement("beforeend", dot);

            dot.addEventListener("click", () => {
                this.clearInterval();
                this.update("", true, parseInt(dot.id.split("-")[1]));
            });
        });
    }

    updateDots() {
        const dots = document.getElementsByClassName("dot");
        this.getCards();

        Array.from(dots).forEach((dot) => {
            dot.classList.remove("active-dot");

            if (parseInt(dot.id.split("-")[1]) == this.cards[1].id.split("-")[1]) {
                dot.classList.add("active-dot");
            }
        });
    }

    autoPlay() {
        this.interval = setInterval(() => {
            this.update("next");
        }, this.playSpeed);
    }

    clearInterval() {
        window.clearInterval(this.interval);
    }
}

// simple code to create a carousel from any container

// const carouselContainer = document.getElementById("carousel-content");
//const prev = document.getElementById('prev')
//const next = document.getElementById('next')

// const carousel = new Carousel(carouselContainer, true, 5000, true); // container, autoplay, speed, dots
// carousel.init();

// UNCOMMENT IF YOU WANT TO USE BUTTONS

// prev.addEventListener('click', () => {
//   const id = prev.id
//   carousel.update(id)
// })
//
// next.addEventListener('click', () => {
//   const id = next.id
//   carousel.update(id)
// })
