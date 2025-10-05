import "./App.css";
import React from "react";
import {ToastContainer} from "react-toastify";
import "./styles/buttons.css";
import "./styles/braille.css";
import {GameContextProvider} from "./contexts/GameContextProvider.tsx";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import LandingPage from "./pages/LandingPage.tsx";
import GamePage from "./pages/GamePage.tsx";
import {useGameContext} from "./contexts/useGameContext.tsx";
import Footer from "./components/Footer.tsx";

const ThemedToastContainer: React.FC = () => {
    const {darkMode} = useGameContext();
    return (
        <ToastContainer
            position="top-right"
            autoClose={2500}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={darkMode ? "dark" : "light"}
            limit={3}
        />
    );
}

function App() {
    return (
        <GameContextProvider>
            <BrowserRouter>
                <ThemedToastContainer />
                <Routes>
                    <Route path="/" element={<LandingPage/>}/>
                    <Route path="/play" element={<GamePage/>}/>

                    <Route path="*" element={<Navigate to="/" replace/>}/>
                </Routes>
                <Footer />
            </BrowserRouter>
        </GameContextProvider>
    );
}

export default App;
