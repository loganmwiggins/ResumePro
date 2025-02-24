// Add more templates here when they are created

import Template_Minimal from '../components/templates/Template_Minimal';
import Template_BoldNavy from '../components/templates/Template_BoldNavy';
import Template_Skyline from '../components/templates/Template_Skyline';
import Template_RosyEdge from '../components/templates/Template_RosyEdge';
import Template_Beeline from '../components/templates/Template_Beeline';

export const templates = [
    // Minimal
    { 
        id: "minimal", 
        name: "Minimal", 
        tagline: "Clean, classic, and effortlessly professional",
        imgPath: "/assets/images/template-thumbnails/Thumbnail_Minimal.png",
        component: Template_Minimal 
    },
    // Bold Navy
    { 
        id: "bold-navy", 
        name: "Bold Navy", 
        tagline: "Strong lines, bold type, and a commanding navy presence",
        imgPath: "/assets/images/template-thumbnails/Thumbnail_BoldNavy.png",
        component: Template_BoldNavy 
    },
    // Skyline
    {
        id: "skyline",
        name: "Skyline",
        // tagline: "Light, airy, and professional like a clear blue sky",
        tagline: "A strong yet calming presence",
        imgPath: "/assets/images/template-thumbnails/Thumbnail_Skyline.png",
        component: Template_Skyline
    },
    // Rosy Edge
    {
        id: "rosy-edge",
        name: "Rosy Edge",
        tagline: "Stand out with subtle elegance and structure",
        imgPath: "/assets/images/template-thumbnails/Thumbnail_RosyEdge.png",
        component: Template_RosyEdge
    },
    // Beeline
    {
        id: "beeline",
        name: "Beeline",
        tagline: "Lead with your name, follow with impact",
        imgPath: "/assets/images/template-thumbnails/Thumbnail_Beeline.png",
        component: Template_Beeline
    }
    
    // Add more ...
];