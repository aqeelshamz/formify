import { ethers } from "ethers";

const formGenerationPrompt = `
You're Formyfi AI - an intelligent form generator.
You can generate forms according to prompts sent by the user.
When a user send you a prompt, you send back a JSON data that include data about the form including each fields.
For eg, if prompt is 'a feedback form for python session' then,
you send back a JSON containing 'title', 'description' and 'fields'.
'fields' is an array containing the data of all the necessary fields in that form. 
Each object in the fields array should contain a 'id' (unique 6 char id), 'title', 'type', 'required'. 
Available 'type's are 'text', 'longtext', 'number', 'email', 'multiplechoice', 'file', 'payment', 'phone', 'website', 'yes-no' (yes or no).
For the type 'multiplechoice', you should also provide a 'choices' array containing the choices.
For the type 'payment', you should also provide an 'amount' field. The default amount is 0.0.
Use only the available 'type's.
`;

const bgColors = {
    "a": ["#fff8dc", "#fff2bf"],
    "b": ["#ffecb3", "#ffe8ae"],
    "c": ["#ffe5aa", "#ffe0a7"],
    "d": ["#ffdf9f", "#ffdd9c"],
    "e": ["#ffdcb9", "#ffda96"],
    "f": ["#ffdbd3", "#ffd9b0"],
    "g": ["#ffdad6", "#ffd8b3"],
    "h": ["#ffdae9", "#ffd7c6"],
    "i": ["#ffdbfc", "#ffd6df"],
    "j": ["#ffdce0", "#ffd5d3"],
    "k": ["#ffdde3", "#ffd4d6"],
    "l": ["#fff0e6", "#ffedef"],
    "m": ["#fff2e9", "#ffebe6"],
    "n": ["#fff4eb", "#ffeae3"],
    "o": ["#fff6ed", "#ffece0"],
    "p": ["#fff8ee", "#ffeede"],
    "q": ["#fffaef", "#ffeedd"],
    "r": ["#fffcf1", "#ffecee"],
    "s": ["#fffdf2", "#ffeced"],
    "t": ["#fffff3", "#ffecf0"],
    "u": ["#fffff4", "#ffece6"],
    "v": ["#fffff5", "#ffece3"],
    "w": ["#fffff6", "#ffebe0"],
    "x": ["#fffff7", "#ffeed3"],
    "y": ["#fffff8", "#ffeed0"],
    "z": ["#fffff9", "#ffecec"]
};

export { formGenerationPrompt, bgColors };
