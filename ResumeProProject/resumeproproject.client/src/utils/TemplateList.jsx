// Add more templates here when they are created

import Template_Minimal from '../components/Templates/Template_Minimal';
import Template_BoldNavy from '../components/Templates/Template_BoldNavy';
import Template_Skyline from '../components/Templates/Template_Skyline'

export const templates = [
    // Minimal
    { 
        id: "minimal", 
        name: "Minimal", 
        tagline: "Clean, classic, and effortlessly professional",
        imgPath: "/assets/template-thumbnails/minimal-thumbnail.png",
        component: Template_Minimal 
    },
    // Bold Navy
    { 
        id: "bold-navy", 
        name: "Bold Navy", 
        tagline: "Strong lines, bold type, and a commanding navy presence",
        imgPath: "/assets/template-thumbnails/boldNavy-thumbnail.png",
        component: Template_BoldNavy 
    },
    // Skyline
    {
        id: "skyline",
        name: "Skyline",
        // tagline: "Light, airy, and professional like a clear blue sky",
        tagline: "A strong yet calming presence",
        imgPath: "/assets/template-thumbnails/skyline-thumbnail.png",
        component: Template_Skyline
    },
    
    // Add more ...
];