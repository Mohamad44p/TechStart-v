/* eslint-disable @typescript-eslint/no-unused-vars */
import * as LucideIcons from 'lucide-react'

export const ICON_CATEGORIES = {
  "Favorites": ["Star", "Heart", "ThumbsUp", "Award", "Trophy", "Medal", "Crown", "Gift"],
  "Actions": ["Play", "Pause", "Skip", "Save", "Edit", "Trash", "Download", "Upload", "Refresh", "Share", "Send", "Reply", "Forward", "Undo", "Redo"],
  "Navigation": ["ChevronLeft", "ChevronRight", "ChevronUp", "ChevronDown", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Menu", "MoreHorizontal", "MoreVertical"],
  "People": ["User", "Users", "UserPlus", "UserMinus", "UserCheck", "Group", "PersonStanding", "Baby", "Family", "UserCog", "UserGear", "UserCircle"],
  "Communication": ["Mail", "MessageCircle", "MessageSquare", "Phone", "PhoneCall", "Megaphone", "Speech", "Messages", "ChatBubble", "AtSign", "Inbox", "SendHorizontal"],
  "Interface": ["Search", "Settings", "Bell", "Calendar", "Clock", "Filter", "Sidebar", "Layout", "Layers", "Grid", "Columns", "Rows", "Table", "List"],
  "Weather": ["Sun", "Moon", "Cloud", "CloudRain", "CloudSnow", "Wind", "Umbrella", "Thermometer", "Sunrise", "Sunset", "Rainbow", "Storm", "Lightning"],
  "Nature": ["Leaf", "Tree", "Flower", "Mountain", "Fish", "Bird", "Paw", "Bug", "Butterfly", "Feather", "Shell"],
  "Business": ["DollarSign", "CreditCard", "Wallet", "ShoppingCart", "ShoppingBag", "Receipt", "Briefcase", "Building", "Store", "Factory", "Bank"],
  "Charts": ["BarChart", "LineChart", "PieChart", "AreaChart", "TrendingUp", "TrendingDown", "ChartBar", "Activity", "Stats", "Graph"],
  "Technology": ["Laptop", "Smartphone", "Tablet", "Desktop", "Wifi", "Bluetooth", "Battery", "Printer", "Server", "Database", "Code", "Terminal", "Cpu", "Chip"],
  "Files": ["File", "FileText", "FilePlus", "FileCheck", "FileX", "Copy", "Clipboard", "ClipboardCheck", "ClipboardList", "Archive", "Folder"],
  "Media": ["Image", "Video", "Music", "Headphones", "Film", "Camera", "Mic", "Radio", "Speaker", "Volume", "Play", "Pause"],
  "Design": ["Palette", "Brush", "PenTool", "Pencil", "Eraser", "Magic", "Wand", "Dropper", "Crop", "Move", "Frame", "Ruler"],
  "Social": ["Github", "Twitter", "Facebook", "Instagram", "Youtube", "Linkedin", "Discord", "Twitch", "Slack", "Dribbble"],
  "Security": ["Lock", "Unlock", "Shield", "Key", "Fingerprint", "Scan", "Eye", "EyeOff", "AlertCircle", "AlertTriangle"],
} as const;

type IconType = keyof typeof LucideIcons;

export const AVAILABLE_ICONS = Object.entries(ICON_CATEGORIES).reduce<Record<string, typeof LucideIcons[IconType]>>((acc, [_, icons]) => {
  icons.forEach(icon => {
    if (icon in LucideIcons) {
      acc[icon] = LucideIcons[icon as IconType];
    }
  });
  return acc;
}, {});

export type IconName = keyof typeof AVAILABLE_ICONS;
export type CategoryName = keyof typeof ICON_CATEGORIES;

