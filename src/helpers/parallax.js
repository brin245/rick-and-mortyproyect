const parallax = (elementSelector, containerSelector) => {
    const homeDOM = document.getElementById(containerSelector);
    const imageDOM = document.querySelectorAll(elementSelector);
  
    if (!homeDOM || !imageDOM.length) {
      return;
    }
  
    const handleMouseMove = (e) => {
      imageDOM.forEach((img) => {
        const speed = img.getAttribute('data-speed') || 1; 
        const x = (window.innerWidth - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;
        img.style.transform = `translateX(${x}px) translateY(${y}px)`;
      });
    };
  
    homeDOM.addEventListener('mousemove', handleMouseMove);
  
    return () => {
      homeDOM.removeEventListener('mousemove', handleMouseMove);
    };
  };
  
  export default parallax;
  