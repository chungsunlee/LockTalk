// src/components/tutorial/TutorialSteps.ts
import { TutorialStep } from '@/types';

/**
 * # Tutorial Content
 * 
 * This array defines the steps for the interactive tutorial.
 * Each object corresponds to one step in the guide.
 * 
 * - `element`: A CSS selector for the UI element to highlight.
 * - `title`: The title displayed in the tutorial popover.
 * - `content`: The explanatory text.
 * - `position`: Where the popover should appear relative to the element.
 * - `showDemo`: A flag to trigger special animations for a step.
 */
export const tutorialSteps: TutorialStep[] = [
  {
    element: 'body', // General introduction
    title: 'Welcome to LockTalk!',
    content: "Let's take a quick tour of how to send secret-agent-level secure messages. It's easier than you think!",
    position: 'bottom',
  },
  {
    element: '#peer-list',
    title: 'The Peer List',
    content: "This is where your fellow LockTalk users on the same network will appear. It’s like a party, but for nerds. If it's empty, you might be the first one to arrive!",
    position: 'right',
  },
  {
    element: '#chat-pane',
    title: 'The Chat Pane',
    content: 'Once you connect with a peer, your conversation will happen here. All messages are end-to-end encrypted. Not even we can see what you’re saying.',
    position: 'left',
  },
  {
    element: '#chat-input',
    title: 'Sending a Message',
    content: "To send a message, just type here and hit enter or click the send button. The backend handles all the magic of encryption for you.",
    position: 'top',
    showDemo: true, // This will trigger a visual demo
  },
    {
    element: '#key-manager',
    title: 'Your Digital ID',
    content: "This area shows your public key. You don't need to do anything with it, but it's proof that you're you. Your much more important *private* key is kept secret on the server.",
    position: 'top',
  },
  {
    element: 'body',
    title: "You're all set!",
    content: "That's it! You're ready to chat securely. Remember, what's said in LockTalk, stays in LockTalk. Probably. Enjoy!",
    position: 'bottom',
  },
];
