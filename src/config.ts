// =====================================================================
// A LITTLE UNIVERSE FOR SID — CUSTOMIZATION CONFIGURATION
// You can easily edit any text, name, letter paragraphs, memories,
// and colors here to personalize this experience for Sid!
// =====================================================================

export interface CustomizationConfig {
  recipient: {
    name: string
    nickname: string
  }
  sender: {
    signature: string
  }
  meta: {
    siteTitle: string
    subtitle: string
  }
  letter: {
    title: string
    paragraphs: string[]
  }
  constellation: {
    title: string
    stars: { id: number; x: number; y: number; message: string }[]
  }
  finalStatements: string[]
  closingLetter: string[]
  finalChoices: {
    id: string
    label: string
    response: string
    emoji: string
    color: string
  }[]
  easterEggs: Record<string, { label: string; text: string }>
}

export const config: CustomizationConfig = {
  recipient: {
    name: 'Sid',
    nickname: 'Sid',
  },
  sender: {
    signature: '— Your slightly clueless, currently improving best friend.',
  },
  meta: {
    siteTitle: 'A Little Universe for Sid',
    subtitle: 'An Interactive Best-Friend Apology Experience',
  },
  letter: {
    title: 'The Letter I Should Have Written Sooner',
    paragraphs: [
      "Hey Sid,",
      "I have been thinking about everything, and one thing I know is that I should have tried to fix things much sooner.",
      "Instead, I let too much time pass. I misunderstood you, and rather than taking a step back, trying to understand your side, and talking things through properly, I let my own understanding of the situation get in the way.",
      "And honestly, the part I regret is that I was willing to let go of a friendship over small fights when I should have been trying to work things out.",
      "Not every disagreement needs to become something bigger. Sometimes, what matters is being willing to listen, communicate, and understand each other instead of giving up too quickly.",
      "I am not writing this to make excuses for myself. I know I could have handled things better, and I am genuinely sorry that I didn't.",
      "You matter to me as a best friend, and I value the friendship we have. I should have shown that through my actions instead of taking so long to make things right.",
      "I also understand that saying sorry now doesn't erase the time that passed or automatically fix everything. I can't change how I handled things before, but I can learn from them and do better going forward.",
      "I'm sorry, Sid. For taking too long, for misunderstanding you, and for not making the effort to work through things when I should have.",
      "You deserved a friend who was willing to communicate instead of considering giving up over small fights.",
      "I'm not expecting you to instantly forgive me or pretend that nothing happened. I just wanted to acknowledge where I went wrong and tell you sincerely that I'm sorry.",
      "Whatever happens next, I respect your feelings and your space.",
      "No grand promises. No excuses. Just an apology I should have given you sooner.",
      "— Your slightly clueless, currently improving best friend.",
    ],
  },
  constellation: {
    title: 'The Friendship Constellation',
    stars: [
      { id: 0, x: 50, y: 25, message: 'I should address problems instead of waiting too long.' },
      { id: 1, x: 72, y: 42, message: 'I should listen before assuming I understand everything.' },
      { id: 2, x: 30, y: 55, message: 'Small fights should not automatically become reasons to give up.' },
      { id: 3, x: 60, y: 68, message: 'I can disagree with someone and still treat them with respect.' },
      { id: 4, x: 22, y: 35, message: 'I should show people that I value them through my actions, not just my words.' },
      { id: 5, x: 82, y: 25, message: 'A sincere apology matters, but consistent behavior matters more.' },
    ],
  },
  finalStatements: [
    "I can't change how I handled things before.",
    "But I can take responsibility for it.",
    "I can listen better.",
    "I can communicate sooner.",
    "I can stop treating every small fight like a reason to give up.",
    "And I can try to show up as a better friend through my actions.",
  ],
  closingLetter: [
    "Sid, I'm genuinely sorry.",
    "I took too long to fix things when I should have made the effort sooner. I misunderstood you, and I was wrong to consider letting go over small fights instead of trying to work things out.",
    "I value you as my best friend, and I wanted to make sure you knew that.",
    "I don't expect a website to fix everything. I just hope this shows that I've thought about where I went wrong.",
    "No pressure to reply right now. Take whatever time you need.",
    "Thank you for being part of my life, Sid.",
  ],
  finalChoices: [
    {
      id: 'okay',
      label: 'Okay, I read it.',
      response: 'Thank you for hearing me out, Sid. I appreciate it.',
      emoji: '✦',
      color: '#7c3aed',
    },
    {
      id: 'time',
      label: 'I need some time.',
      response: "Of course. Take the time you need. There's no rush.",
      emoji: '🌙',
      color: '#5b21b6',
    },
    {
      id: 'talk',
      label: "Let's talk sometime.",
      response: "Whenever you're comfortable. I'll listen.",
      emoji: '✈️',
      color: '#4c1d95',
    },
  ],
  easterEggs: {
    moon: {
      label: 'The Moon Confession',
      text: 'I had a whole speech prepared, and somehow this website became the speech.',
    },
    printer: {
      label: 'The Office Printer',
      text: 'Printing another excuse... ERROR: Excuses are not accepted here.',
    },
    clock: {
      label: 'The Timekeeper Complaint',
      text: 'The clock has officially filed a complaint about my timing.',
    },
    ego: {
      label: 'Character Development',
      text: 'Character development. Finally.',
    },
    chai: {
      label: 'Imaginary Chai',
      text: 'Imaginary chai. Real apology.',
    },
    trophy: {
      label: 'Best Friend Trophy',
      text: 'Certified best friend. Currently working on the improvement part.',
    },
    airplane: {
      label: 'Message Delivered',
      text: 'Message delivered. No reply required.',
    },
  },
}
