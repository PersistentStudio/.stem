export function clickOutside(node: HTMLElement, callback: () => void) {
    const handleClick = (event: MouseEvent) => {
        // Check if the click was outside the node
        if (!node.contains(event.target as Node)) {
            callback();
        }
    };

    // Attach the event listener
    document.addEventListener('click', handleClick);

    // Cleanup function to remove the event listener
    return {
        destroy() {
            document.removeEventListener('click', handleClick);
        }
    };
}