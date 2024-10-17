import { createContext, useState, useContext } from 'react';
const CursorContext = createContext();
export const useCursorContext = () => useContext(CursorContext);
export const CursorContextProvider = ({ children }) => {
  const [initialCursorVariant, setInitialCursorVariant] = useState('');
  const [animateCursorVariant, setAnimateCursorVariant] = useState('');
// This function allows for smooth transitions between cursor states
  const animateCursor = (variant) => {
    setInitialCursorVariant(animateCursorVariant);
    setAnimateCursorVariant(variant);
  };
  return (
    <CursorContext.Provider
      value={{
        initialCursorVariant,
        setInitialCursorVariant,
        animateCursorVariant,
        setAnimateCursorVariant,
        animateCursor,
      }}
    >
      {children}
    </CursorContext.Provider>
  );
};

// src/components/CustomCursor.jsx
import { motion, useMotionValue } from 'framer-motion';
import { useEffect } from 'react';
import '../assets/style/custom-cursor.css';
import { useCursorContext } from '../components/CursorContext.jsx';

function Cursor() {
  const { initialCursorVariant, animateCursorVariant, animateCursor } = useCursorContext();
  const cursorX = useMotionValue();
  const cursorY = useMotionValue();

  const variants = {
    cursorEnter: {
      border: '1px solid #eeff00',
      boxShadow: '0 0 1px 0px #eeff00 inset, 0 0 1px 0px #eeff00',
      scale: 2,
      borderRadius: '50%',
      backgroundColor: 'transparent',
      transition: {
        duration: 0.2,
      },
    },
    cursorLeave: {
      scale: 0,
      border: 0,
      backgroundColor: 'transparent',
      transition: {
        duration: 0.2,
      },
    },
    buttonHover: {
      scale: 1,
      backgroundColor: '#eeff00',
      borderRadius: '50%',
    },
  };

  useEffect(() => {
    const app = document.querySelector('#app');
    const mouseMoveHandler = (e) => {
      cursorX.set(e.clientX - 12);
      cursorY.set(e.clientY - 12);
    };
    const mouseEnterHandler = () => {
      animateCursor('cursorEnter');
    };
    const mouseLeaveHandler = () => {
      animateCursor('cursorLeave');
    };
    window.addEventListener('mousemove', mouseMoveHandler);
    app.addEventListener('mouseenter', mouseEnterHandler);
    app.addEventListener('mouseleave', mouseLeaveHandler);
    return () => {
      window.removeEventListener('mousemove', mouseMoveHandler);
      app.removeEventListener('mouseenter', mouseEnterHandler);
      app.removeEventListener('mouseleave', mouseLeaveHandler);
    };
  }, [animateCursor, cursorX, cursorY]);

  return (
    <motion.div
      className="cursor"
      variants={variants}
      initial={initialCursorVariant}
      animate={animateCursorVariant}
      style={{
        translateX: cursorX,
        translateY: cursorY,
        transformOrigin: 'center',
      }}
    />
  );
}

export default Cursor;

// src/components/ButtonHover.jsx
import { motion } from 'framer-motion';
import '../assets/style/button-hover.css';
import { useCursorContext } from '../components/CursorContext.jsx';

function ButtonHover() {
  const { animateCursor } = useCursorContext();
  const mouseEnterHandler = () => {
    animateCursor('buttonHover');
  };
  const mouseLeaveHandler = () => {
    animateCursor('cursorEnter');
  };
  return (
    <motion.button
      className="button-hover"
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
      initial={{
        backgroundColor: '#000',
        color: '#fff',
      }}
      whileHover={{
        backgroundColor: '#eeff00',
        color: '#000',
      }}
      whileTap={{
        scale: 0.9,
      }}
    >
      Hover and Click Me!
    </motion.button>
  );
}



// src/App.jsx
import './App.css';
import CustomCursor from './components/CustomCursor.jsx';
import ButtonHover from './components/ButtonHover.jsx';
import { CursorContextProvider } from './components/CursorContext.jsx';

function App() {
  return (
    <div id="app">
      <CursorContextProvider>
        <CustomCursor />
        <div className="center">
          <ButtonHover />
        </div>
      </CursorContextProvider>
    </div>
  );
}

