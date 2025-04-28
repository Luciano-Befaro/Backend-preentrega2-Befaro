const socket = io();

// Recibir lista actualizada de productos
socket.on('products', (products) => {
  const list = document.getElementById('productList');
  list.innerHTML = '';
  products.forEach(prod => {
    const li = document.createElement('li');
    li.textContent = `${prod.title} - $${prod.price}`;
    list.appendChild(li);
  });
});

// Capturar envío de formulario
const form = document.getElementById('addProductForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const price = document.getElementById('price').value;

  socket.emit('addProduct', { title, price });

  form.reset(); // Limpiar formulario
});