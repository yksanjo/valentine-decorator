// Valentine's Heart Decorator
class HeartDecorator {
    constructor() {
        this.heartContainer = document.getElementById('heartContainer');
        this.decorationZone = document.getElementById('decorationZone');
        this.heartSvg = document.getElementById('heartSvg');
        this.decorations = [];
        this.selectedDecoration = null;
        this.draggedElement = null;
        this.pulseInterval = null;
        this.isPulsing = false;
        
        this.settings = {
            heartSize: 1,
            heartColor: 'pink',
            pulseEnabled: false,
            sparkleEnabled: false
        };
        
        this.init();
    }
    
    init() {
        this.setupDragAndDrop();
        this.setupControls();
        this.setupInteractions();
    }
    
    setupDragAndDrop() {
        const decorationItems = document.querySelectorAll('.decoration-item');
        
        decorationItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                this.draggedElement = e.target;
                e.dataTransfer.effectAllowed = 'copy';
            });
        });
        
        this.decorationZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });
        
        this.decorationZone.addEventListener('drop', (e) => {
            e.preventDefault();
            if (this.draggedElement) {
                const rect = this.decorationZone.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.addDecoration(this.draggedElement.dataset.type, x, y);
            }
        });
        
        decorationItems.forEach(item => {
            item.addEventListener('click', () => {
                const rect = this.decorationZone.getBoundingClientRect();
                this.addDecoration(item.dataset.type, rect.width / 2, rect.height / 2);
            });
        });
    }
    
    addDecoration(type, x, y) {
        const decoration = document.createElement('div');
        decoration.className = 'decoration';
        decoration.dataset.type = type;
        
        const emojis = {
            'heart': '❤️', 'kiss': '💋', 'rose': '🌹', 'cupid': '👼',
            'gift': '🎁', 'ring': '💍', 'sparkle': '✨', 'star': '⭐',
            'flower': '🌸', 'butterfly': '🦋', 'ribbon': '🎀', 'bell': '🔔',
            'love': '💕', 'xoxo': '💋', 'forever': '💑', 'be-mine': '💘'
        };
        
        decoration.textContent = emojis[type] || '💕';
        decoration.style.left = x + 'px';
        decoration.style.top = y + 'px';
        
        this.makeDraggable(decoration);
        
        decoration.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectDecoration(decoration);
        });
        
        decoration.addEventListener('dblclick', () => {
            decoration.remove();
            this.decorations = this.decorations.filter(d => d !== decoration);
        });
        
        this.decorationZone.appendChild(decoration);
        this.decorations.push(decoration);
    }
    
    makeDraggable(element) {
        let isDragging = false;
        let initialX, initialY;
        
        element.addEventListener('mousedown', (e) => {
            if (e.target === element || element.contains(e.target)) {
                isDragging = true;
                element.classList.add('dragging');
                initialX = e.clientX - element.offsetLeft;
                initialY = e.clientY - element.offsetTop;
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                const rect = this.decorationZone.getBoundingClientRect();
                let currentX = e.clientX - initialX;
                let currentY = e.clientY - initialY;
                currentX = Math.max(0, Math.min(currentX, rect.width - 40));
                currentY = Math.max(0, Math.min(currentY, rect.height - 40));
                element.style.left = currentX + 'px';
                element.style.top = currentY + 'px';
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                element.classList.remove('dragging');
            }
        });
    }
    
    selectDecoration(decoration) {
        if (this.selectedDecoration) {
            this.selectedDecoration.classList.remove('selected');
        }
        this.selectedDecoration = decoration;
        decoration.classList.add('selected');
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Delete' && this.selectedDecoration) {
                this.selectedDecoration.remove();
                this.decorations = this.decorations.filter(d => d !== this.selectedDecoration);
                this.selectedDecoration = null;
            }
        }, { once: true });
    }
    
    setupControls() {
        const sizeSlider = document.getElementById('heartSize');
        const sizeValue = document.getElementById('heartSizeValue');
        sizeSlider.addEventListener('input', (e) => {
            this.settings.heartSize = parseFloat(e.target.value);
            sizeValue.textContent = Math.round(this.settings.heartSize * 100) + '%';
            this.heartSvg.style.transform = `scale(${this.settings.heartSize})`;
            this.heartSvg.style.transformOrigin = 'center top';
        });
        
        document.getElementById('heartColor').addEventListener('change', (e) => {
            this.settings.heartColor = e.target.value;
            this.updateHeartColor();
        });
        
        document.getElementById('pulseBtn').addEventListener('click', () => {
            this.togglePulse();
        });
        
        document.getElementById('enablePulse').addEventListener('change', (e) => {
            this.settings.pulseEnabled = e.target.checked;
            this.updatePulse();
        });
        
        document.getElementById('enableSparkle').addEventListener('change', (e) => {
            this.settings.sparkleEnabled = e.target.checked;
        });
        
        document.getElementById('clearBtn').addEventListener('click', () => {
            if (confirm('Clear all decorations?')) {
                this.decorations.forEach(dec => dec.remove());
                this.decorations = [];
            }
        });
        
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportHeart();
        });
    }
    
    setupInteractions() {
        this.decorationZone.addEventListener('click', (e) => {
            if (e.target === this.decorationZone && this.selectedDecoration) {
                this.selectedDecoration.classList.remove('selected');
                this.selectedDecoration = null;
            }
        });
    }
    
    updateHeartColor() {
        this.heartContainer.className = 'heart-container heart-' + this.settings.heartColor;
    }
    
    togglePulse() {
        this.isPulsing = !this.isPulsing;
        this.updatePulse();
    }
    
    updatePulse() {
        if (this.settings.pulseEnabled || this.isPulsing) {
            this.heartSvg.classList.add('pulse-active');
        } else {
            this.heartSvg.classList.remove('pulse-active');
        }
    }
    
    exportHeart() {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#fff0f5';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#FF1493';
        ctx.beginPath();
        ctx.moveTo(400, 700);
        ctx.bezierCurveTo(200, 500, 40, 300, 40, 180);
        ctx.bezierCurveTo(40, 80, 140, 20, 260, 20);
        ctx.bezierCurveTo(340, 20, 400, 100, 400, 100);
        ctx.bezierCurveTo(400, 100, 460, 20, 540, 20);
        ctx.bezierCurveTo(660, 20, 760, 80, 760, 180);
        ctx.bezierCurveTo(760, 300, 600, 500, 400, 700);
        ctx.fill();
        
        this.decorations.forEach(dec => {
            const rect = dec.getBoundingClientRect();
            const zoneRect = this.decorationZone.getBoundingClientRect();
            const x = (rect.left - zoneRect.left) * (canvas.width / zoneRect.width);
            const y = (rect.top - zoneRect.top) * (canvas.height / zoneRect.height);
            ctx.font = '40px Arial';
            ctx.fillText(dec.textContent, x, y);
        });
        
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'valentine-heart.png';
            a.click();
            URL.revokeObjectURL(url);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new HeartDecorator();
});
