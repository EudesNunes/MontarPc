"use strict";
var confetti = window.confetti;
/* ==================== Dados ==================== */
var pieces = [
    {
        id: "cpu",
        src: "assets/cpu.svg",
        top: 100,
        left: 90,
        width: 60,
        height: 60,
    },
    {
        id: "cooler",
        src: "assets/cooler.svg",
        top: 100,
        left: 90,
        width: 60,
        height: 60,
    },
    {
        id: "ram",
        src: "assets/ram.svg",
        top: 70,
        left: 240,
        width: 15,
        height: 160,
    },
    {
        id: "gpu",
        src: "assets/gpu.svg",
        top: 310,
        left: 55,
        width: 120,
        height: 30,
    },
    {
        id: "ssd",
        src: "assets/ssd.svg",
        top: 250,
        left: 60,
        width: 110,
        height: 45,
    },
    {
        id: "psu",
        src: "assets/psu.svg",
        top: 240,
        left: 380,
        width: 120,
        height: 60,
    },
];
var pieceInfo = {
    cpu: {
        title: "Processador (CPU)",
        desc: "É o “cérebro” do computador. Responsável por executar instruções e processar dados. Quanto mais núcleos e maior a velocidade (GHz), mais tarefas simultâneas ele pode realizar.",
    },
    gpu: {
        title: "Placa de Vídeo (GPU)",
        desc: "Responsável pelo processamento gráfico. Essencial para jogos, edição de vídeo e programas que exigem gráficos avançados. Pode ser integrada (junto com a CPU) ou dedicada.",
    },
    ram: {
        title: "Memória RAM",
        desc: "Memória temporária que armazena dados enquanto o computador está ligado. Ajuda na velocidade e no desempenho ao executar vários programas ao mesmo tempo.",
    },
    psu: {
        title: "Fonte de Alimentação (PSU)",
        desc: "Converte a energia da tomada em energia estável para todos os componentes.",
    },
    ssd: {
        title: "SSD",
        desc: "Dispositivo de armazenamento sólido; muito mais rápido que um HD tradicional.",
    },
    cooler: {
        title: "Cooler (Dissipador)",
        desc: "Componente que resfria o processador ou outros itens internos. Evita o superaquecimento e ajuda o computador a funcionar de forma estável.",
    },
};
var questions = [
    {
        text: "Qual componente executa operações lógicas e aritméticas fundamentais, além de controlar o fluxo de instruções?",
        options: ["CPU", "GPU", "Fonte de alimentação"],
        correctIndex: 0,
        pieceId: "cpu",
    },
    {
        text: "Qual peça utiliza milhares de pequenos núcleos de processamento para cálculos gráficos em paralelo?",
        options: ["SSD", "GPU", "RAM"],
        correctIndex: 1,
        pieceId: "gpu",
    },
    {
        text: "Que tipo de memória volátil, baseada em DRAM, armazena dados temporários durante a execução de aplicações?",
        options: ["Placa‑mãe", "RAM", "SSD"],
        correctIndex: 1,
        pieceId: "ram",
    },
    {
        text: "Qual componente, em padrão ATX, converte corrente alternada da rede elétrica em múltiplas tensões DC estáveis?",
        options: ["Fonte de alimentação", "CPU", "Cooler"],
        correctIndex: 0,
        pieceId: "psu",
    },
    {
        text: "Qual dispositivo de armazenamento mantém os dados mesmo com o computador desligado, seja em disco magnético ou memória flash?",
        options: ["HD/SSD", "GPU", "RAM"],
        correctIndex: 0,
        pieceId: "ssd",
    },
    {
        text: "Que componente combina um dissipador metálico e ventoinha para remover calor do processador?",
        options: ["Cooler", "SSD", "Memória RAM"],
        correctIndex: 0,
        pieceId: "cooler",
    },
];
/* ==================== Classe ==================== */
var PcQuizGame = /** @class */ (function () {
    function PcQuizGame(qs, pcs) {
        this.qs = qs;
        this.pcs = pcs;
        this.current = 0;
        this.lives = 2;
        this.wrongAudio = document.getElementById("wrong-sound");
        this.gameOverAudio = document.getElementById("gameover-sound");
        this.certoAudio = document.getElementById("certo-sound");
        this.cabinet = document.getElementById("cabinet");
        this.questionEl = document.getElementById("question");
        this.answersEl = document.getElementById("answers");
        this.feedbackEl = document.getElementById("feedback");
        this.panelEl = document.getElementById("panel");
        this.renderQuestion();
    }
    PcQuizGame.prototype.updateLivesDisplay = function () {
        var _this = this;
        var hearts = Array.from(document.querySelectorAll("#lives .heart"));
        hearts.forEach(function (img, idx) {
            if (idx < _this.lives) {
                img.style.visibility = "visible";
                // se só restar uma vida, faz o coração sobrevivente piscar
                if (_this.lives === 1 && idx === 0) {
                    img.classList.add("blink");
                }
                else {
                    img.classList.remove("blink");
                }
            }
            else {
                img.style.visibility = "hidden";
                img.classList.remove("blink");
            }
        });
    };
    PcQuizGame.prototype.resetGame = function () {
        // Remove todas as peças já montadas
        this.cabinet.querySelectorAll(".pc-piece").forEach(function (el) { return el.remove(); });
        this.lives = 2;
        this.updateLivesDisplay();
        // Se ainda tiver overlay, remove também
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = undefined;
        }
        // Volta ao começo
        this.current = 0;
        // Limpa feedback
        this.feedbackEl.textContent = "";
        // Desenha a primeira pergunta
        this.renderQuestion();
    };
    /* ---------- Pergunta ---------- */
    PcQuizGame.prototype.renderQuestion = function () {
        var _this = this;
        this.updateLivesDisplay();
        if (this.current >= this.qs.length) {
            this.questionEl.textContent = "Parabéns! Você montou o PC 🎉";
            this.answersEl.innerHTML = "";
            this.feedbackEl.textContent = "";
            // Cria botão Reiniciar
            var btn = document.createElement("button");
            btn.textContent = "↻ Reiniciar";
            btn.style.marginTop = "12px";
            btn.onclick = function () { return _this.resetGame(); };
            this.answersEl.appendChild(btn);
            return;
        }
        var q = this.qs[this.current];
        this.questionEl.textContent = q.text;
        this.feedbackEl.textContent = "";
        this.answersEl.innerHTML = "";
        q.options.forEach(function (opt, idx) {
            var btn = document.createElement("button");
            btn.textContent = opt;
            btn.onclick = function () { return _this.checkAnswer(idx); };
            var li = document.createElement("li");
            li.appendChild(btn);
            _this.answersEl.appendChild(li);
        });
    };
    PcQuizGame.prototype.checkAnswer = function (idx) {
        var _this = this;
        var q = this.qs[this.current];
        if (idx === q.correctIndex) {
            this.certoAudio.currentTime = 0;
            this.certoAudio.play();
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
            this.showModal(q.pieceId);
        }
        else {
            // toca som de erro
            if (this.lives > 1) {
                this.wrongAudio.currentTime = 0;
                this.wrongAudio.play();
                this.showPopup("assets/pop-wrong.gif", function () {
                    _this.feedbackEl.textContent = "\u274C Errou! Vidas restantes: ".concat(_this.lives);
                });
            }
            this.lives--;
            this.updateLivesDisplay();
            if (this.lives <= 0) {
                this.gameOver();
            }
            else {
                this.feedbackEl.textContent = "\u274C Errou!";
            }
        }
    };
    PcQuizGame.prototype.gameOver = function () {
        var _this = this;
        this.gameOverAudio.currentTime = 0;
        this.gameOverAudio.play();
        this.showPopup("assets/pop-gameover.gif", function () { return _this.resetGame(); });
        this.questionEl.textContent = "Game Over 💥";
        this.answersEl.innerHTML = "";
        this.feedbackEl.textContent = "";
        // botão reiniciar
        var btn = document.createElement("button");
        btn.textContent = "↻ Reiniciar";
        btn.style.marginTop = "12px";
        btn.onclick = function () { return _this.resetGame(); };
        this.answersEl.appendChild(btn);
    };
    /* ---------- Pop‑up ---------- */
    PcQuizGame.prototype.showPopup = function (imgSrc, onClose) {
        var overlay = document.createElement("div");
        overlay.className = "modal-overlay";
        var box = document.createElement("div");
        box.className = "modal";
        box.innerHTML = "<img src=\"".concat(imgSrc, "\" style=\"max-width:100%;\"/><br/>");
        // fecha com clique
        overlay.onclick = function () {
            document.body.removeChild(overlay);
            onClose === null || onClose === void 0 ? void 0 : onClose();
        };
        overlay.appendChild(box);
        document.body.appendChild(overlay);
    };
    PcQuizGame.prototype.showModal = function (pieceId) {
        var info = pieceInfo[pieceId];
        var overlay = document.createElement("div");
        overlay.className = "modal-overlay";
        var box = document.createElement("div");
        box.className = "modal";
        var closeBtn = document.createElement("button");
        closeBtn.className = "close-btn";
        closeBtn.textContent = "X";
        closeBtn.addEventListener("click", function (ev) {
            ev.stopPropagation(); // impede o clique de vazar
            close();
        });
        box.innerHTML = "<h2>".concat(info.title, "</h2><p>").concat(info.desc, "</p>");
        box.prepend(closeBtn);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
        var closeSelf = this;
        function close() {
            document.body.removeChild(overlay);
            closeSelf.feedbackEl.textContent =
                "✅ Correto! Agora clique no local da peça.";
            // cria zona clicável no próximo tick
            setTimeout(function () { return closeSelf.preparePlacement(pieceId); }, 0);
        }
    };
    /* ---------- Zona clicável ---------- */
    PcQuizGame.prototype.preparePlacement = function (pieceId) {
        var _this = this;
        this.questionEl.style.display = "none";
        this.answersEl.style.display = "none";
        var p = this.pcs.find(function (pc) { return pc.id === pieceId; });
        if (!p)
            return;
        this.overlay = document.createElement("div");
        this.overlay.style.cssText = "\n    position:absolute;\n    top:".concat(p.top, "px;left:").concat(p.left, "px;\n    width:").concat(p.width, "px;height:").concat(p.height, "px;\n    background:rgba(255,0,0,.25);      /* preenchimento vermelho claro */\n    border:2px dashed #ff0000;         /* contorno vermelho */\n    box-shadow:0 0 6px 2px rgba(255,0,0,.5) inset; /* leve brilho interno */\n    cursor:pointer;\n  ");
        this.overlay.onclick = function () { return _this.placePiece(pieceId); };
        this.cabinet.appendChild(this.overlay);
    };
    /* ---------- Encaixe ---------- */
    PcQuizGame.prototype.placePiece = function (pieceId) {
        var _this = this;
        if (this.overlay) {
            this.cabinet.removeChild(this.overlay);
            this.overlay = undefined;
        }
        var container = this.cabinet.getBoundingClientRect();
        var scale = container.width / 600; // 600 é a largura original do gabinete
        var p = this.pcs.find(function (pc) { return pc.id === pieceId; });
        if (!p)
            return;
        var img = document.createElement("img");
        img.src = p.src;
        img.alt = pieceId;
        img.className = "pc-piece";
        img.style.cssText = "\n      position: absolute;\n      top: ".concat(p.top * scale, "px;\n      left: ").concat(p.left * scale, "px;\n      width: ").concat(p.width * scale, "px;\n      height: ").concat(p.height * scale, "px;\n      opacity:0;transform:scale(.8);\n      transition:opacity .5s, transform .5s;\n    ");
        this.cabinet.appendChild(img);
        requestAnimationFrame(function () {
            img.style.opacity = "1";
            img.style.transform = "scale(1)";
        });
        this.current++;
        this.questionEl.style.display = "";
        this.answersEl.style.display = "";
        setTimeout(function () { return _this.renderQuestion(); }, 600);
    };
    return PcQuizGame;
}());
/* ---------- Boot ---------- */
window.addEventListener("DOMContentLoaded", function () {
    new PcQuizGame(questions, pieces);
});
