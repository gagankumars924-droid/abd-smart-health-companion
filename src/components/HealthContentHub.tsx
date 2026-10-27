import React, { useState } from "react";
import {
  Video, Play, Bookmark, Heart, ThumbsUp, ThumbsDown, Search, Filter,
  Share2, Eye, PlusCircle, Edit3, Trash2, ShieldCheck, Sparkles, AlertCircle,
  ExternalLink, Clock, Tag, X, Check, Megaphone, Info
} from "lucide-react";
import {
  HealthContentItem,
  HealthContentCategory,
  HealthCampaignBanner,
  Language
} from "../types";

interface HealthContentHubProps {
  contentItems: HealthContentItem[];
  campaignBanners: HealthCampaignBanner[];
  onUpdateContentItems: (items: HealthContentItem[]) => void;
  onUpdateCampaignBanners: (banners: HealthCampaignBanner[]) => void;
  lang: Language;
  onShowToast?: (msg: string, type?: "success" | "error" | "info") => void;
}

const CATEGORIES: HealthContentCategory[] = [
  "General health and hygiene",
  "Women's health",
  "Child health and nutrition",
  "Mental health and well-being",
  "Diabetes and blood pressure",
  "Communicable diseases",
  "Preventive healthcare and vaccination",
  "Government health schemes and ABDM awareness"
];

export default function HealthContentHub({
  contentItems,
  campaignBanners,
  onUpdateContentItems,
  onUpdateCampaignBanners,
  lang,
  onShowToast
}: HealthContentHubProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [contentTypeFilter, setContentTypeFilter] = useState<string>("all");
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(["cnt-1", "cnt-4"]);
  const [likedIds, setLikedIds] = useState<string[]>(["cnt-1"]);
  const [userFeedback, setUserFeedback] = useState<Record<string, "helpful" | "unhelpful">>({
    "cnt-1": "helpful"
  });
  const [viewHistoryIds, setViewHistoryIds] = useState<string[]>(["cnt-1", "cnt-2"]);
  const [activeTab, setActiveTab] = useState<"browse" | "bookmarks" | "history" | "campaigns">("browse");

  // Video/Article Player Modal State
  const [activeItem, setActiveItem] = useState<HealthContentItem | null>(null);

  // Admin Management Modal & State
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [editingItem, setEditingItem] = useState<HealthContentItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // New Content Form State
  const [contentForm, setContentForm] = useState({
    title: "",
    titleHi: "",
    titleOr: "",
    description: "",
    descriptionHi: "",
    descriptionOr: "",
    contentType: "video" as "video" | "clip" | "infographic" | "article",
    category: "General health and hygiene" as HealthContentCategory,
    duration: "4:00 min",
    language: "all" as "en" | "hi" | "or" | "all",
    thumbnailUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80",
    videoUrl: "",
    articleBody: "",
    isSponsored: false,
    sponsorName: "",
    tags: "Health, ABDM"
  });

  // Admin Campaign Form State
  const [isManagingCampaigns, setIsManagingCampaigns] = useState(false);
  const [newCampaignTitle, setNewCampaignTitle] = useState("");
  const [newCampaignSubtitle, setNewCampaignSubtitle] = useState("");
  const [newCampaignSponsor, setNewCampaignSponsor] = useState("");
  const [newCampaignCategory, setNewCampaignCategory] = useState("Public Health");

  const triggerToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    if (onShowToast) onShowToast(msg, type);
  };

  // Filter content
  const filteredContent = contentItems.filter((item) => {
    // Category match
    if (selectedCategory !== "All" && item.category !== selectedCategory) return false;
    // Type match
    if (contentTypeFilter !== "all" && item.contentType !== contentTypeFilter) return false;
    // Language match
    if (languageFilter !== "all" && item.language !== "all" && item.language !== languageFilter) return false;
    // Search query match across English, Hindi, and Odia
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchEn = item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
      const matchHi = item.titleHi?.toLowerCase().includes(q) || item.descriptionHi?.toLowerCase().includes(q);
      const matchOr = item.titleOr?.toLowerCase().includes(q) || item.descriptionOr?.toLowerCase().includes(q);
      const matchTag = item.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchEn && !matchHi && !matchOr && !matchTag) return false;
    }
    // Tabs
    if (activeTab === "bookmarks" && !bookmarkedIds.includes(item.id)) return false;
    if (activeTab === "history" && !viewHistoryIds.includes(item.id)) return false;
    return true;
  });

  const handleOpenItem = (item: HealthContentItem) => {
    setActiveItem(item);
    if (!viewHistoryIds.includes(item.id)) {
      setViewHistoryIds([item.id, ...viewHistoryIds]);
    }
  };

  const handleToggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter((b) => b !== id));
      triggerToast("Removed from bookmarks", "info");
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
      triggerToast("Saved to your health bookmarks!", "success");
    }
  };

  const handleToggleLike = (item: HealthContentItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isLiked = likedIds.includes(item.id);
    if (isLiked) {
      setLikedIds(likedIds.filter((id) => id !== item.id));
      const updated = contentItems.map((ci) =>
        ci.id === item.id ? { ...ci, likes: Math.max(0, ci.likes - 1) } : ci
      );
      onUpdateContentItems(updated);
    } else {
      setLikedIds([...likedIds, item.id]);
      const updated = contentItems.map((ci) =>
        ci.id === item.id ? { ...ci, likes: ci.likes + 1 } : ci
      );
      onUpdateContentItems(updated);
      triggerToast("Liked! Thanks for encouraging verified health content.", "success");
    }
  };

  const handleFeedback = (item: HealthContentItem, type: "helpful" | "unhelpful", e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const current = userFeedback[item.id];
    let helpfulDelta = 0;
    let unhelpfulDelta = 0;

    if (current === type) {
      // Toggle off
      const next = { ...userFeedback };
      delete next[item.id];
      setUserFeedback(next);
      if (type === "helpful") helpfulDelta = -1;
      else unhelpfulDelta = -1;
    } else {
      // Set or switch
      if (current === "helpful") helpfulDelta = -1;
      if (current === "unhelpful") unhelpfulDelta = -1;
      if (type === "helpful") helpfulDelta += 1;
      if (type === "unhelpful") unhelpfulDelta += 1;
      setUserFeedback({ ...userFeedback, [item.id]: type });
      triggerToast(type === "helpful" ? "Marked as helpful. Thank you!" : "Feedback recorded.", "info");
    }

    const updated = contentItems.map((ci) =>
      ci.id === item.id
        ? {
            ...ci,
            helpfulCount: Math.max(0, ci.helpfulCount + helpfulDelta),
            unhelpfulCount: Math.max(0, ci.unhelpfulCount + unhelpfulDelta)
          }
        : ci
    );
    onUpdateContentItems(updated);
  };

  // Admin content actions
  const handleDeleteItem = (id: string) => {
    const updated = contentItems.filter((i) => i.id !== id);
    onUpdateContentItems(updated);
    triggerToast("Content item removed from registry.", "info");
  };

  const handleSaveContentForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentForm.title.trim()) return;

    if (editingItem) {
      const updated = contentItems.map((ci) =>
        ci.id === editingItem.id
          ? {
              ...ci,
              title: contentForm.title,
              titleHi: contentForm.titleHi || undefined,
              titleOr: contentForm.titleOr || undefined,
              description: contentForm.description,
              descriptionHi: contentForm.descriptionHi || undefined,
              descriptionOr: contentForm.descriptionOr || undefined,
              contentType: contentForm.contentType,
              category: contentForm.category,
              duration: contentForm.duration,
              language: contentForm.language,
              thumbnailUrl: contentForm.thumbnailUrl,
              articleBody: contentForm.articleBody,
              isSponsored: contentForm.isSponsored,
              sponsorName: contentForm.sponsorName || undefined,
              tags: contentForm.tags.split(",").map((t) => t.trim())
            }
          : ci
      );
      onUpdateContentItems(updated);
      triggerToast("Content updated successfully!", "success");
      setEditingItem(null);
    } else {
      const newItem: HealthContentItem = {
        id: `cnt-${Date.now()}`,
        title: contentForm.title,
        titleHi: contentForm.titleHi || undefined,
        titleOr: contentForm.titleOr || undefined,
        description: contentForm.description,
        descriptionHi: contentForm.descriptionHi || undefined,
        descriptionOr: contentForm.descriptionOr || undefined,
        contentType: contentForm.contentType,
        category: contentForm.category,
        duration: contentForm.duration,
        language: contentForm.language,
        thumbnailUrl: contentForm.thumbnailUrl,
        articleBody: contentForm.articleBody,
        likes: 0,
        helpfulCount: 0,
        unhelpfulCount: 0,
        isSponsored: contentForm.isSponsored,
        sponsorName: contentForm.sponsorName || undefined,
        publishedDate: new Date().toISOString().split("T")[0],
        tags: contentForm.tags.split(",").map((t) => t.trim())
      };
      onUpdateContentItems([newItem, ...contentItems]);
      triggerToast("New educational health content published!", "success");
      setIsCreatingNew(false);
    }

    // Reset form
    setContentForm({
      title: "",
      titleHi: "",
      titleOr: "",
      description: "",
      descriptionHi: "",
      descriptionOr: "",
      contentType: "video",
      category: "General health and hygiene",
      duration: "4:00 min",
      language: "all",
      thumbnailUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80",
      videoUrl: "",
      articleBody: "",
      isSponsored: false,
      sponsorName: "",
      tags: "Health, ABDM"
    });
  };

  const handleStartEdit = (item: HealthContentItem) => {
    setEditingItem(item);
    setContentForm({
      title: item.title,
      titleHi: item.titleHi || "",
      titleOr: item.titleOr || "",
      description: item.description,
      descriptionHi: item.descriptionHi || "",
      descriptionOr: item.descriptionOr || "",
      contentType: item.contentType,
      category: item.category,
      duration: item.duration || "4:00 min",
      language: item.language,
      thumbnailUrl: item.thumbnailUrl || "",
      videoUrl: item.videoUrl || "",
      articleBody: item.articleBody || "",
      isSponsored: !!item.isSponsored,
      sponsorName: item.sponsorName || "",
      tags: item.tags.join(", ")
    });
  };

  const handleAddCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaignTitle.trim()) return;
    const newCamp: HealthCampaignBanner = {
      id: `cmp-${Date.now()}`,
      title: newCampaignTitle,
      subtitle: newCampaignSubtitle || "Empaneled awareness initiative",
      category: newCampaignCategory,
      sponsor: newCampaignSponsor || "Public Health Directorate",
      badgeText: "Sponsored Partner Campaign",
      active: true,
      isOfficialGovScheme: false
    };
    onUpdateCampaignBanners([newCamp, ...campaignBanners]);
    setNewCampaignTitle("");
    setNewCampaignSubtitle("");
    setNewCampaignSponsor("");
    triggerToast("Promotional / Awareness campaign added!", "success");
  };

  const handleToggleCampaignStatus = (id: string) => {
    const updated = campaignBanners.map((b) =>
      b.id === id ? { ...b, active: !b.active } : b
    );
    onUpdateCampaignBanners(updated);
    triggerToast("Campaign visibility toggled.", "info");
  };

  const handleDeleteCampaign = (id: string) => {
    onUpdateCampaignBanners(campaignBanners.filter((b) => b.id !== id));
    triggerToast("Campaign removed.", "info");
  };

  // Helper for localized title
  const getLocalizedTitle = (item: HealthContentItem) => {
    if (lang === "or" && item.titleOr) return item.titleOr;
    if (lang === "hi" && item.titleHi) return item.titleHi;
    return item.title;
  };

  const getLocalizedDescription = (item: HealthContentItem) => {
    if (lang === "or" && item.descriptionOr) return item.descriptionOr;
    if (lang === "hi" && item.descriptionHi) return item.descriptionHi;
    return item.description;
  };

  return (
    <div className="space-y-6 animate-fade-in text-left pb-16">
      {/* Header with Title and Admin Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h2 className="font-sans font-black text-slate-900 dark:text-white text-lg md:text-xl flex items-center gap-2">
            <Video className="h-5.5 w-5.5 text-blue-600 dark:text-blue-400" />
            <span>Health Content & Video Hub</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              Verified Medical & ABDM
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Educational videos, clips, infographics and articles in English, हिन्दी (Hindi), and ଓଡ଼ିଆ (Odia).
          </p>
        </div>

        {/* Right side controls: Admin Switch */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={() => setIsAdminMode(!isAdminMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              isAdminMode
                ? "bg-amber-600 text-white border-amber-500 shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-750"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>{isAdminMode ? "Admin Mode Active" : "Admin Content Desk"}</span>
          </button>
        </div>
      </div>

      {/* Admin Quick Control Bar if in Admin Mode */}
      {isAdminMode && (
        <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-200 dark:border-amber-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
            <Edit3 className="h-4.5 w-4.5 text-amber-600" />
            <span>
              <strong>Administrative Content Control:</strong> Add, edit, or remove videos, articles, and sponsor campaigns.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingItem(null);
                setIsCreatingNew(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Add New Video/Article</span>
            </button>
            <button
              onClick={() => setIsManagingCampaigns(!isManagingCampaigns)}
              className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
            >
              <Megaphone className="h-3.5 w-3.5" />
              <span>Manage Campaigns & Ads</span>
            </button>
          </div>
        </div>
      )}

      {/* Admin Campaign Management Drawer */}
      {isAdminMode && isManagingCampaigns && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-150 dark:border-slate-800 pb-2">
            <h4 className="font-black text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <Megaphone className="h-4 w-4 text-amber-600" />
              <span>Awareness Campaign & Sponsored Banner Registry</span>
            </h4>
            <button
              onClick={() => setIsManagingCampaigns(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              Close
            </button>
          </div>

          <form onSubmit={handleAddCampaign} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 block mb-1">Campaign Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Free Oral Cancer Screening Drive"
                value={newCampaignTitle}
                onChange={(e) => setNewCampaignTitle(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1">Sponsor / Partner Name</label>
              <input
                type="text"
                placeholder="e.g. Tata Memorial Trust"
                value={newCampaignSponsor}
                onChange={(e) => setNewCampaignSponsor(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl transition cursor-pointer"
              >
                + Publish Banner
              </button>
            </div>
          </form>

          {/* List of active banners */}
          <div className="space-y-2 pt-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Existing Promotional & Awareness Banners ({campaignBanners.length})</p>
            {campaignBanners.map((camp) => (
              <div
                key={camp.id}
                className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-800 dark:text-slate-100">{camp.title}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${camp.active ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"}`}>
                      {camp.active ? "Active" : "Hidden"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{camp.subtitle} • Sponsor: {camp.sponsor}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleCampaignStatus(camp.id)}
                    className="px-2.5 py-1 text-[11px] bg-slate-200 dark:bg-slate-800 rounded-lg font-bold hover:bg-slate-300 transition"
                  >
                    {camp.active ? "Pause" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleDeleteCampaign(camp.id)}
                    className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reserved Clearly Labeled Spaces for Awareness Campaigns & Sponsored Content */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 uppercase font-black tracking-widest text-[9.5px]">
            <Megaphone className="h-3.5 w-3.5 text-amber-500" />
            <span>Health Awareness Campaigns & Outreach</span>
          </div>
          <span className="text-[9px] text-slate-400 italic">
            Non-commercial • Visually separate from clinical advice
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {campaignBanners
            .filter((c) => c.active)
            .map((campaign) => (
              <div
                key={campaign.id}
                className="p-3.5 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 rounded-2xl border border-amber-200/70 dark:border-amber-900/40 flex flex-col justify-between shadow-xs relative overflow-hidden"
              >
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300/40">
                      {campaign.badgeText}
                    </span>
                    <span className="text-[8.5px] text-slate-400 font-mono">Verified</span>
                  </div>
                  <h4 className="font-black text-xs text-slate-900 dark:text-white leading-snug font-sans">
                    {campaign.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {campaign.subtitle}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-amber-100 dark:border-slate-800 flex justify-between items-center text-[10px]">
                  <span className="text-slate-400 font-medium truncate max-w-[170px]">
                    By: {campaign.sponsor}
                  </span>
                  <a
                    href={campaign.targetUrl || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>Know More</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
        </div>

        {/* Campaign Data Privacy Disclaimer */}
        <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-800/60 flex items-start gap-2 text-[10px] text-slate-500">
          <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
          <span>
            <strong>Citizen Privacy Guarantee:</strong> Awareness campaigns and sponsored educational programs are strictly prohibited from accessing your ABHA health locker, clinical records, or personal demographics.
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs & Filter Controls */}
      <div className="space-y-3">
        {/* Main Tab Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-1.5">
            {[
              { id: "browse", label: "All Content", count: contentItems.length },
              { id: "bookmarks", label: "My Bookmarks", count: bookmarkedIds.length },
              { id: "history", label: "Viewing History", count: viewHistoryIds.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Language selector for content */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Language:</span>
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="p-1 px-2 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer focus:outline-none"
            >
              <option value="all">All Languages</option>
              <option value="en">English (EN)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="or">ଓଡ଼ିଆ (Odia)</option>
            </select>
          </div>
        </div>

        {/* Search Bar & Media Type Pills */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="md:col-span-2 relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search videos, articles, vaccines, diabetes, hygiene in English, हिन्दी, ଓଡ଼ିଆ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Content Type Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {[
              { id: "all", label: "All" },
              { id: "video", label: "Videos" },
              { id: "clip", label: "Clips" },
              { id: "infographic", label: "Infographics" },
              { id: "article", label: "Articles" }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setContentTypeFilter(t.id)}
                className={`flex-1 py-1 text-[10.5px] font-bold rounded-lg transition text-center cursor-pointer ${
                  contentTypeFilter === t.id
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Horizontal Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition ${
              selectedCategory === "All"
                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content Cards Grid */}
      {filteredContent.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContent.map((item) => {
            const isBookmarked = bookmarkedIds.includes(item.id);
            const isLiked = likedIds.includes(item.id);
            const feedback = userFeedback[item.id];

            return (
              <div
                key={item.id}
                onClick={() => handleOpenItem(item)}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between cursor-pointer group"
              >
                {/* Thumbnail Header */}
                <div className="relative aspect-video bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={item.thumbnailUrl || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

                  {/* Play Button Overlay */}
                  {(item.contentType === "video" || item.contentType === "clip") && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-10 w-10 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                        <Play className="h-5 w-5 fill-white ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Duration Tag */}
                  {item.duration && (
                    <span className="absolute bottom-2 right-2 bg-slate-950/80 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      {item.duration}
                    </span>
                  )}

                  {/* Language & Content Type Pill */}
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[8.5px] font-bold px-2 py-0.5 rounded-md uppercase">
                      {item.contentType}
                    </span>
                    {item.language !== "all" && (
                      <span className="bg-blue-600/90 text-white text-[8.5px] font-bold px-1.5 py-0.5 rounded-md uppercase">
                        {item.language === "hi" ? "हिन्दी" : item.language === "or" ? "ଓଡ଼ିଆ" : "English"}
                      </span>
                    )}
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => handleToggleBookmark(item.id, e)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/70 text-white hover:text-amber-400 backdrop-blur-xs transition"
                    title={isBookmarked ? "Remove bookmark" : "Bookmark video"}
                  >
                    <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-amber-400 text-amber-400" : ""}`} />
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-[9px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
                      <span>{item.category}</span>
                    </div>

                    <h3 className="font-sans font-black text-xs md:text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug">
                      {getLocalizedTitle(item)}
                    </h3>

                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {getLocalizedDescription(item)}
                    </p>
                  </div>

                  {/* Engagement & Feedback Row */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                    {/* Likes & Feedback */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleToggleLike(item, e)}
                        className={`flex items-center gap-1 hover:text-rose-500 transition cursor-pointer ${
                          isLiked ? "text-rose-500 font-bold" : ""
                        }`}
                        title="Like this content"
                      >
                        <Heart className={`h-3.5 w-3.5 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                        <span>{item.likes}</span>
                      </button>

                      <span className="text-slate-300 dark:text-slate-700">•</span>

                      {/* Helpful Button */}
                      <button
                        onClick={(e) => handleFeedback(item, "helpful", e)}
                        className={`flex items-center gap-1 hover:text-emerald-600 transition cursor-pointer ${
                          feedback === "helpful" ? "text-emerald-600 font-bold" : ""
                        }`}
                        title="Was this helpful?"
                      >
                        <ThumbsUp className={`h-3 w-3 ${feedback === "helpful" ? "fill-emerald-600" : ""}`} />
                        <span>{item.helpfulCount}</span>
                      </button>

                      {/* Unhelpful Button */}
                      <button
                        onClick={(e) => handleFeedback(item, "unhelpful", e)}
                        className={`flex items-center gap-1 hover:text-slate-700 transition cursor-pointer ${
                          feedback === "unhelpful" ? "text-slate-800 font-bold" : ""
                        }`}
                        title="Not helpful"
                      >
                        <ThumbsDown className={`h-3 w-3 ${feedback === "unhelpful" ? "fill-slate-700" : ""}`} />
                        <span>{item.unhelpfulCount}</span>
                      </button>
                    </div>

                    {/* Admin Actions if Admin Mode */}
                    {isAdminMode ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEdit(item);
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition"
                          title="Edit"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItem(item.id);
                          }}
                          className="p-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-blue-600 dark:text-blue-400 font-bold text-[10px] group-hover:underline flex items-center gap-0.5">
                        Watch / Read →
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <Video className="h-8 w-8 text-slate-400 mx-auto" />
          <h4 className="font-black text-sm text-slate-700 dark:text-slate-300">
            No health videos or articles found
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords, clearing language filters, or browsing other categories.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setContentTypeFilter("all");
              setLanguageFilter("all");
            }}
            className="mt-2 px-3 py-1.5 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700 cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Detail / Video Modal Player */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 max-w-2xl w-full rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6 animate-scale-in">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-150 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded-full uppercase">
                  {activeItem.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {activeItem.duration || "Educational Resource"}
                </span>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs hover:bg-slate-300 transition"
              >
                ✕
              </button>
            </div>

            {/* Simulated Video Player / Media Display */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              {activeItem.contentType === "video" || activeItem.contentType === "clip" ? (
                <div className="w-full h-full relative group">
                  <img
                    src={activeItem.thumbnailUrl}
                    alt={activeItem.title}
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                    <div className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-xl cursor-pointer transition transform hover:scale-105">
                      <Play className="h-7 w-7 fill-white ml-1" />
                    </div>
                    <p className="text-xs font-bold bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
                      Interactive ABDM Media Player • High Definition 1080p
                    </p>
                  </div>
                </div>
              ) : (
                <img
                  src={activeItem.thumbnailUrl}
                  alt={activeItem.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Modal Content Details */}
            <div className="p-5 space-y-4 max-h-96 overflow-y-auto">
              <div>
                <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white font-sans">
                  {getLocalizedTitle(activeItem)}
                </h3>
                {activeItem.titleHi && lang !== "hi" && (
                  <p className="text-xs text-slate-500 font-sans mt-0.5">
                    हिन्दी: {activeItem.titleHi}
                  </p>
                )}
                {activeItem.titleOr && lang !== "or" && (
                  <p className="text-xs text-slate-500 font-sans mt-0.5">
                    ଓଡ଼ିଆ: {activeItem.titleOr}
                  </p>
                )}
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <p className="font-bold text-slate-400 text-[10px] uppercase mb-1">Summary Overview</p>
                <p>{getLocalizedDescription(activeItem)}</p>
              </div>

              {activeItem.articleBody && (
                <div className="space-y-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  <h4 className="font-extrabold text-slate-800 dark:text-slate-100">Key Health Guidelines</h4>
                  <p className="whitespace-pre-line bg-blue-50/50 dark:bg-blue-950/20 p-3 rounded-xl border border-blue-100 dark:border-blue-900/40">
                    {activeItem.articleBody}
                  </p>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {activeItem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Engagement action bar in modal */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-150 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleLike(activeItem)}
                    className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300 hover:text-rose-500 transition cursor-pointer"
                  >
                    <Heart className={`h-4 w-4 ${likedIds.includes(activeItem.id) ? "fill-rose-500 text-rose-500" : ""}`} />
                    <span>{activeItem.likes} Likes</span>
                  </button>
                  <button
                    onClick={() => handleFeedback(activeItem, "helpful")}
                    className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition cursor-pointer"
                  >
                    <ThumbsUp className={`h-4 w-4 ${userFeedback[activeItem.id] === "helpful" ? "fill-emerald-600 text-emerald-600" : ""}`} />
                    <span>Helpful ({activeItem.helpfulCount})</span>
                  </button>
                </div>

                <button
                  onClick={() => handleToggleBookmark(activeItem.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 text-xs transition cursor-pointer ${
                    bookmarkedIds.includes(activeItem.id)
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  <Bookmark className="h-3.5 w-3.5" />
                  <span>{bookmarkedIds.includes(activeItem.id) ? "Bookmarked" : "Bookmark"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Create / Edit Content Modal */}
      {(isCreatingNew || editingItem) && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 max-w-xl w-full rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 my-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-150 dark:border-slate-800 pb-3">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-blue-600" />
                <span>{editingItem ? "Edit Health Content Item" : "Create Verified Health Content"}</span>
              </h3>
              <button
                onClick={() => {
                  setIsCreatingNew(false);
                  setEditingItem(null);
                }}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveContentForm} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Title (English) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Preventing Dengue: Home Checklist"
                  value={contentForm.title}
                  onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Title in हिन्दी (Hindi)</label>
                  <input
                    type="text"
                    placeholder="हिन्दी शीर्षक"
                    value={contentForm.titleHi}
                    onChange={(e) => setContentForm({ ...contentForm, titleHi: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Title in ଓଡ଼ିଆ (Odia)</label>
                  <input
                    type="text"
                    placeholder="ଓଡ଼ିଆ ଶୀର୍ଷକ"
                    value={contentForm.titleOr}
                    onChange={(e) => setContentForm({ ...contentForm, titleOr: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Category *</label>
                  <select
                    value={contentForm.category}
                    onChange={(e) => setContentForm({ ...contentForm, category: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Format *</label>
                  <select
                    value={contentForm.contentType}
                    onChange={(e) => setContentForm({ ...contentForm, contentType: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  >
                    <option value="video">Video</option>
                    <option value="clip">Short Clip</option>
                    <option value="infographic">Infographic</option>
                    <option value="article">Article</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Description / Summary *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Short educational synopsis"
                  value={contentForm.description}
                  onChange={(e) => setContentForm({ ...contentForm, description: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Article Body / Transcript</label>
                <textarea
                  rows={3}
                  placeholder="Detailed guidelines, dosages, or advice points"
                  value={contentForm.articleBody}
                  onChange={(e) => setContentForm({ ...contentForm, articleBody: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 4:15 min or 3 min read"
                    value={contentForm.duration}
                    onChange={(e) => setContentForm({ ...contentForm, duration: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Vaccine, Child, Diet"
                    value={contentForm.tags}
                    onChange={(e) => setContentForm({ ...contentForm, tags: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-150 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition cursor-pointer"
                >
                  {editingItem ? "Save Changes" : "Publish Content"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
