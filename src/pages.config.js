import Home from './pages/Home';
import TaxCalculator from './pages/TaxCalculator';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "TaxCalculator": TaxCalculator,
}

export const pagesConfig = {
    mainPage: "TaxCalculator",
    Pages: PAGES,
    Layout: __Layout,
};