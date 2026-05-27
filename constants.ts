import { Terminal, Cpu as Chip, Code2, Layers, Globe, Github, Linkedin, Mail, Code } from 'lucide-react';

export const PROFILE = {
  name: "Abhradeep Pal",
  title: "AI & Intelligent Embedded Systems Engineer",
  subtitle: "B.E. Computer Science (AI & ML) @ Chandigarh University",
  location: "Bankura, West Bengal, India",
  email: "abhradeeppal2025@gmail.com",
  github: "https://www.linkedin.com/in/abhradeep-pal-14ab8637a/", // Note: Backwards compatibility with previous layout requirements
  linkedin: "https://www.linkedin.com/in/abhradeep-pal-14ab8637a/",
  hackerrank: "https://www.hackerrank.com/profile/25BAI70056",
  actualGithub: "https://github.com/palabhradeep635-star"
};

export const CAREER_OBJECTIVE = "Seeking opportunities at the intersection of Deep Learning and real-world sensing. Driven to deploy high-throughput inference models onto memory-constrained microcontrollers, creating low-power, zero-latency autonomous telemetry systems.";

export const ABOUT_INTRO = "I build intelligent systems that bridge high-level artificial intelligence and low-level hardware constraints. Rather than designing isolated models or simple hardware wrappers, I specialize in full-stack hardware-software integration, bringing automated decision engines to the computational edge.";

export const ABOUT_TECH_SPECIALIZATION = "My core expertise lands at the intersection of embedded C/C++, IoT telemetry pipelines, and transfer learning workflows. I engineer real-time datastreams, design custom sensor arrays, and optimize deep convolutional networks (such as EfficientNet models) to operate natively under hardware restrictions.";

export const ABOUT_DIRECTION = "I am mapping my trajectory toward advanced Edge AI and robotics systems, striving to substitute traditional cloud-dependent telemetry with modular, self-governing on-device machine intelligence.";

export const ABOUT_ME = `${ABOUT_INTRO}\n\n${ABOUT_TECH_SPECIALIZATION}\n\n${ABOUT_DIRECTION}`;

export const SKILLS = [
  {
    category: "AI & Deep Learning",
    icon: Terminal,
    items: ["EfficientNet-B0", "TensorFlow / Keras", "Computer Vision", "OpenCV", "Transfer Learning", "Python"]
  },
  {
    category: "Intelligent IoT & Hardware",
    icon: Chip,
    items: ["ESP32 / Arduino", "Embedded C++", "Telemetry Pipelines", "Ubidots Telemetry", "I2C / SPI Protocols", "Sensor Integration"]
  },
  {
    category: "Engineering Principles",
    icon: Code2,
    items: ["Git / GitHub versioning", "O(N) Complexity Optimization", "Object-Oriented Programming", "System Debugging", "Linux Environments", "Data Structures"]
  }
];

export const PROJECTS = [
  {
    title: "AI-Powered Plant Disease Detection System",
    description: "Developed an AI-powered plant disease detection system using EfficientNet-B0 deep learning architecture for automated disease classification from plant leaf images.",
    tech: ["EfficientNet-B0", "TensorFlow/Keras", "Python", "OpenCV", "NumPy"],
    focus: "Artificial Intelligence, Computer Vision, Deep Learning",
    impact: "94.2% validation accuracy classification on leaf image inference with pipeline latency optimized to 45ms.",
    features: [
      "AI-based disease prediction",
      "Computer vision classification",
      "Transfer learning implementation",
      "EfficientNet-B0 inference pipeline",
      "Optimized prediction workflow"
    ]
  },
  {
    title: "Smart Wardrobe System (Patent-Based Innovation Project)",
    description: "Worked on a patent-oriented intelligent wardrobe automation system focused on smart management, embedded systems integration, and intelligent automation workflows.",
    tech: ["ESP32", "MicroPython", "RFID Interfacing", "Actuators/Sensors", "Automation Logic"],
    focus: "Innovation systems, automation architecture, intelligent systems",
    impact: "Designed custom sensing mechanism and low-power control sequence for state-machine wardrobe allocation.",
    features: [
      "Intelligent automation concepts",
      "Smart interaction workflow",
      "Embedded systems integration",
      "User-centric smart functionality"
    ]
  },
  {
    title: "AquaSense — Smart Water Monitoring & Telemetry System",
    description: "Developed a real-time IoT-based water monitoring and telemetry system using ESP32, water level sensors, Ubidots cloud telemetry platform, and Arduino IDE.",
    tech: ["ESP32", "Ubidots", "Water Sensors", "Embedded C++", "Arduino IDE"],
    focus: "Telemetry systems, IoT architecture, embedded programming",
    impact: "Achieved continuous low-latency edge-to-cloud telemetry transmission with <200ms trigger loops.",
    features: [
      "Real-time telemetry transmission",
      "Smart monitoring dashboard",
      "Overflow prevention alert system",
      "Remote monitoring capability",
      "Reliable hardware–software integration"
    ]
  },
  {
    title: "Smart Radar Detection & Telemetry System",
    description: "Developed a smart sensor-based monitoring and telemetry system capable of real-time environmental scanning, object detection, and automated notifications.",
    tech: ["ESP32/Arduino", "Sensors", "Embedded C++", "IoT telemetry systems"],
    focus: "Intelligent monitoring systems, embedded telemetry, automation",
    impact: "Engineered synchronized ultrasonic-servo sweep sweep logic to map 180° obstacles in low light.",
    features: [
      "Real-time detection",
      "Telemetry transmission",
      "Notification systems",
      "Sensor-driven monitoring",
      "Intelligent alert architecture"
    ]
  },
  {
    title: "Algorithmic Problem Solving & DSA",
    description: "Engineered optimized implementations of core data structures and algorithmic problem-solving patterns in C++, focusing on computational efficiency and scalable logic design.",
    tech: ["C++", "DSA", "OOP"],
    focus: "Algorithm engineering, optimization, scalable problem solving",
    impact: "Solved over 150+ complexity-critical algorithms, achieving optimized runtime performance.",
    features: [
      "Advanced recursion",
      "Linked Lists",
      "Stacks and Queues",
      "Complexity optimization",
      "Competitive programming logic"
    ]
  },
  {
    title: "Autonomous Line Following & Obstacle Avoidance Robot",
    description: "Developed an autonomous robotic system capable of line following and obstacle avoidance using embedded programming and sensor integration.",
    tech: ["Arduino", "Ultrasonic Sensor", "IR Sensors", "Embedded C/C++"],
    focus: "Robotics systems, sensor integration, autonomous control",
    impact: "Implemented low-latency feedback loop for precise tracking and sudden obstruction response.",
    features: [
      "Autonomous navigation",
      "Obstacle detection",
      "Sensor-based movement logic",
      "Robotics fundamentals"
    ]
  }
];

export const EDUCATION = [
  {
    institution: "Chandigarh University",
    degree: "Bachelor of Engineering in Computer Science (AI & ML)",
    period: "2025 — 2029",
    location: "Mohali, Punjab",
    metricType: "Current SGPA",
    metricValue: "8.14",
    highlights: [
      "Specializing in Artificial Intelligence & Machine Learning",
      "Focus on Embedded Systems and Intelligent Monitoring Systems"
    ]
  },
  {
    institution: "Vivekananda Shiksha Niketan High School",
    degree: "Class XII (Higher Secondary Science)",
    period: "Completed",
    location: "West Bengal, India",
    metricType: "Performance",
    metricValue: "88.4%",
    highlights: ["Rigorous scientific track with physics, chemistry, and mathematics foundations"]
  },
  {
    institution: "Vivekananda Shiksha Niketan High School",
    degree: "Class X (Secondary Education)",
    period: "Completed",
    location: "West Bengal, India",
    metricType: "Performance",
    metricValue: "89.14%",
    highlights: ["Broad curriculum emphasizing analytical problem solving and scientific fundamentals"]
  }
];

export const ACADEMIC_CREDENTIALS = {
  entranceExam: "Achieved 97.927 percentile in competitive entrance examination."
};
