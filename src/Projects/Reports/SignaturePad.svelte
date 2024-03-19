<script>
  import { onMount } from 'svelte';

let canvas;


    let ctx;

    onMount(() => {
        ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;

        const getEventPosition = (event) => {
            const rect = canvas.getBoundingClientRect();
            return {
                x: (event.clientX || event.touches[0].clientX) - rect.left,
                y: (event.clientY || event.touches[0].clientY) - rect.top
            };
        };


        const startDrawing = (event) => {
            const { x, y } = getEventPosition(event);
            ctx.beginPath();
            ctx.moveTo(x, y);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('touchmove', draw);
        };

        const draw = (event) => {
            const { x, y } = getEventPosition(event);
            ctx.lineTo(x, y);
            ctx.stroke();
        };

        const stopDrawing = () => {
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('touchmove', draw);
        };

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseleave', stopDrawing);
        canvas.addEventListener('touchstart', startDrawing);
        canvas.addEventListener('touchend', stopDrawing);
    });

    export function getSignatureImage() {
        if (!canvas) return ''; // Si canvas no está definido, retorna una cadena vacía
        let canvaImage = canvas.toDataURL('image/png');
        clearSignature();
        return canvaImage;
    }
    export function clearSignature () {
    if (ctx && canvas) {
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}
</script>

<canvas bind:this={canvas} width="450" height="300" style="border: 1px solid #ccc;"></canvas>

<style>
    canvas {
        touch-action: none;
    }
</style>
