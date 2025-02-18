// Array of possible greetings
const greetings = [
    "Hi", "Hey", "Hello", "Welcome", "Greetings", "What's up", "Howdy",
    "Good to see you", "Hey there", "Hello there"
];
const morningGreetings = [
    "Good morning", "Good morrow", "Rise and shine", "Morning", 
    "Top of the morning", "Grand risings"
];
const afternoonGreetings = [
    "Good afternoon", "Afternoon", "Good day"
];
const eveningGreetings = [
    "Good evening", "Evening", "Good night"
];


// Determine time-based greetings
const currentHour = new Date().getHours();
let timeBasedGreetings = [];

if (currentHour >= 5 && currentHour < 12) {
    timeBasedGreetings = morningGreetings;
} 
else if (currentHour >= 12 && currentHour < 18) {
    timeBasedGreetings = afternoonGreetings;
} 
else {
    timeBasedGreetings = eveningGreetings;
}


// Export array of ALL possible greetnigs
export const allGreetings = [...greetings, ...timeBasedGreetings];

// Export array of possible messages
export const messages = [
    "Create your own custom resume to apply for jobs.",
    "Ready to make a resume?",
    "Your dream job starts with a great resume!",
    "Showcase your skills with a professional resume.",
    "Time to build a resume that stands out!",
    "Make a resume that gets you hired.",
    "Polish your resume and land that job!",
    "Craft a resume that highlights your strengths.",
    "Your next job is just a great resume away!",
    "Let’s make your resume shine.",
    "Stand out in the job market with a stellar resume.",
    "Turn your skills into an opportunity with a great resume.",
    "Get one step closer to your dream job.",
    "Put your best foot forward with a top-notch resume.",
    "Your career journey starts with a strong resume.",
    "A resume that speaks for you – let's build it!",
    "Let’s get that resume looking sharp!",
    "Ready to impress recruiters? Let's start!",
    "Make your resume as amazing as you are."
];