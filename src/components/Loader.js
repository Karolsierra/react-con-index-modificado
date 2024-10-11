// Loader.js
import React from 'react';

// Estilos del componente Loader
const styles = {
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo semi-transparente
    zIndex: 9999, // Asegurarse de que esté encima de otros elementos
  },
  spinner: {
    border: '8px solid #f3f3f3', /* Color del fondo */
    borderTop: '8px solid #3498db', /* Color del spinner */
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 2s linear infinite',
  },
};

// Componente Loader
const Loader = () => {
  return (
    <div style={styles.loader}>
      <div style={styles.spinner}></div>
    </div>
  );
};

export default Loader;
