import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Map from './Map';
import { ChakraProvider, theme } from '@chakra-ui/react'

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <BrowserRouter>
        <ChakraProvider theme={theme}>
           <Routes>
                <Route path="/" element={<Map />} />
            </Routes>
        </ChakraProvider>
    </BrowserRouter>
)