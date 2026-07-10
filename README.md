# React + TypeScript + Vite

This is a single-day project for a React frontend interview.
The built project is an interactive Kanban Task board.

I used the AI agent [v0 by Vercel](https://v0.app/), as my coding assistant.

Here is the history of my prompt
## Create the project prompt

- Build a modern polished React and Tailwind CSS Kanban board component. Include tasks with titles, descriptions, priority tags (low, medium, high), due dates, and column status. Add a sleek dark-mode aesthetic, search input, and a modal to add new tasks.`

## Modify the output prompts

- Make the priority badges softer and add a progress bar at the top
- Change the frontend tooling from next.js to vite

## Understanding the code prompt

- Please explain what this code does in simple terms:
{{the code}}

## Improving the product prompts

- Implement React's useState and useEffect hooks to persist task movements
and additions to local storage
- Add robust filter handlers so users can search tasks by title or filter
by priority flags. Return your answer as a unified diff, with unchanged
context included

## Optimization prompt

- Analyze this code and suggest optimizations or improvements. If nothing
needs changing, say so.


## In Summary

- I visited vO by Vercel, a web based AI agent
- I submitted prompts to it
- I integrated the generated code to my local setup by copying
- I improved on the code's design by implementing local storage persistence,
and robust filters.
