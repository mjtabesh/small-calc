import TaxCalculator from './pages/TaxCalculator';
import Home from './pages/Home';
import __Layout from './Layout.jsx';


export const PAGES = {
    "TaxCalculator": TaxCalculator,
    "Home": Home,
}

export const pagesConfig = {
    mainPage: "TaxCalculator",
    Pages: PAGES,
    Layout: __Layout,
};