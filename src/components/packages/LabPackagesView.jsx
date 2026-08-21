import React, { useState } from 'react';
import { 
  TestTube2, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Award, 
  Calendar, 
  Building2, 
  ShieldCheck, 
  ChevronRight, 
  Home, 
  AlertCircle,
  X,
  Droplet,
  Flame,
  FileCheck,
  Pill,
  Tag
} from 'lucide-react';
import { LAB_PACKAGES_DATA, WELLNESS_MILESTONES_BADGES } from '../../data/labPackagesData';

export default function LabPackagesView({ activeProfile }) {
  const [selectedPackage, setSelectedPackage] = useState(LAB_PACKAGES_DATA[0]);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  const [bookingForm, setBookingForm] = useState({
    date: 'Tomorrow (18 Aug 2026)',
    timeSlot: '07:00 AM - 08:30 AM (Fasting Slot)',
    address: '402, Green Meadows Residency, Sector 45, Gurugram',
    contactNumber: '+91 98765 43210'
  });

  const profilePackages = LAB_PACKAGES_DATA.filter(
    p => p.recommendedFor === activeProfile.id || p.recommendedFor === 'user-arjun'
  );

  const handleBookLab = (pkg, lab) => {
    setSelectedPackage(pkg);
    setSelectedLab(lab);
    setBookingSuccess(false);
    setBookingModalOpen(true);
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="card-white p-5 bg-gradient-to-r from-white via-emerald-50/40 to-teal-50/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-green text-xs font-bold">
                <TestTube2 className="w-3.5 h-3.5 text-brand-green-600" /> PREVENTIVE LAB PACKAGES & BOOKING
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">{activeProfile.name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-1">
              Personalized Diagnostic Packages & Home Collection
            </h2>
          </div>

          <span className="badge-pink text-xs font-bold">
            NABL / CAP Accredited Lab Partners
          </span>
        </div>
      </div>

      {/* Wellness Milestones & Badges Ribbon */}
      <div className="card-white p-6 bg-gradient-to-br from-white via-brand-green-50/20 to-brand-pink-50/20 border-emerald-200">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-brand-pink-500 to-rose-600 text-white rounded-xl shadow-xs">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base font-display">
                Health Habits & Preventive Milestone Badges
              </h3>
              <p className="text-xs text-slate-500">
                Earn wellness badges by staying consistent with screening, medications, and vitals.
              </p>
            </div>
          </div>

          <span className="badge-green text-xs font-bold">
            3 Badges Earned
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-4">
          {WELLNESS_MILESTONES_BADGES.map((badge) => (
            <div key={badge.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className={`p-2 rounded-xl text-white ${
                  badge.color === 'pink' ? 'bg-rose-500' : badge.color === 'teal' ? 'bg-teal-500' : badge.color === 'amber' ? 'bg-amber-500' : 'bg-emerald-600'
                }`}>
                  {badge.icon === 'Pill' && <Pill className="w-4 h-4" />}
                  {badge.icon === 'Droplet' && <Droplet className="w-4 h-4" />}
                  {badge.icon === 'FileCheck' && <FileCheck className="w-4 h-4" />}
                  {badge.icon === 'Flame' && <Flame className="w-4 h-4" />}
                </span>

                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  badge.status === 'EARNED' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {badge.status === 'EARNED' ? '✓ Earned' : '⏳ In Progress'}
                </span>
              </div>

              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                {badge.title}
              </h4>

              <p className="text-[11px] text-slate-500 leading-snug">
                {badge.description}
              </p>

              <div className="text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-100">
                {badge.earnedDate}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Lab Packages List */}
      <div className="space-y-6">
        <h3 className="font-extrabold text-slate-900 text-lg font-display flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-green-600" />
          AI Recommended Diagnostic Checkups for {activeProfile.name}
        </h3>

        <div className="grid grid-cols-1 gap-6">
          {profilePackages.map((pkg) => (
            <div key={pkg.id} className="card-white p-6 sm:p-7 space-y-5 border-l-4 border-l-brand-green-600">
              
              {/* Package Header */}
              <div className="flex items-start justify-between flex-wrap gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="badge-pink text-[10px] font-bold">
                      {pkg.popularBadge}
                    </span>
                    <span className="text-[10px] font-extrabold text-brand-green-800 bg-brand-green-50 px-2.5 py-0.5 rounded-full border border-brand-green-200">
                      {pkg.urgency}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-extrabold text-slate-900 font-display">
                    {pkg.title}
                  </h4>

                  <p className="text-xs text-slate-600 mt-1">
                    💡 <strong className="text-slate-800">Why recommended:</strong> {pkg.reason}
                  </p>
                </div>

                <div className="text-right text-xs">
                  <span className="font-bold text-slate-700 block">Fasting Requirement</span>
                  <span className="text-emerald-700 font-semibold">{pkg.fastingHours}</span>
                </div>
              </div>

              {/* Included Parameters Chips */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Includes {pkg.includedParametersCount} Diagnostic Parameters:
                </span>
                
                <div className="flex items-center gap-1.5 flex-wrap">
                  {pkg.includedParameters.map((param, idx) => (
                    <span key={idx} className="text-xs bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-xl font-medium">
                      ✓ {param}
                    </span>
                  ))}
                </div>
              </div>

              {/* Lab Partner Price Comparison Matrix */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Compare NABL Lab Prices & Book Home Collection:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {pkg.labPrices.map((lab, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-brand-green-300 rounded-2xl transition-all space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <strong className="text-xs font-bold text-slate-900">{lab.labName}</strong>
                          <span className="text-[10px] text-emerald-800 bg-emerald-100 font-bold px-1.5 py-0.2 rounded">NABL</span>
                        </div>

                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-base font-extrabold text-brand-green-700">{lab.price}</span>
                          <span className="text-xs text-slate-400 line-through">{lab.originalPrice}</span>
                        </div>

                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Reports in: <strong>{lab.turnaround}</strong> • ★ {lab.rating}
                        </div>
                      </div>

                      <button
                        onClick={() => handleBookLab(pkg, lab)}
                        className="w-full btn-primary-green text-xs py-1.5 justify-center mt-2"
                      >
                        Book Home Slot
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Home Sample Booking Modal */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="badge-green text-[10px] font-bold block mb-1">
                  NABL Certified Phlebotomist Dispatch
                </span>
                <h3 className="text-base font-extrabold text-slate-900 font-display">
                  Book Home Sample Collection
                </h3>
              </div>
              <button onClick={() => setBookingModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto font-bold text-xl shadow-xs">
                  ✓
                </div>
                <h4 className="text-base font-extrabold text-slate-900">Home Collection Confirmed!</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  A certified phlebotomist from <strong>{selectedLab?.labName}</strong> will arrive at your address on <strong>{bookingForm.date}</strong> ({bookingForm.timeSlot}).
                </p>
                <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs text-emerald-950 font-medium">
                  💧 <strong>Fasting Preparation:</strong> Please refrain from solid food or sugary drinks for 10-12 hours prior to sample collection. Plain water is permitted.
                </div>
                <button
                  onClick={() => setBookingModalOpen(false)}
                  className="btn-primary-green text-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-3.5 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-500">Package: <strong className="text-slate-900">{selectedPackage?.title}</strong></div>
                  <div className="text-slate-500">Lab Partner: <strong className="text-emerald-800">{selectedLab?.labName} ({selectedLab?.price})</strong></div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Collection Date</label>
                  <select
                    value={bookingForm.date}
                    onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option>Tomorrow (18 Aug 2026)</option>
                    <option>Day After (19 Aug 2026)</option>
                    <option>Saturday (22 Aug 2026)</option>
                    <option>Sunday (23 Aug 2026)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Preferred Time Slot (Fasting Recommended)</label>
                  <select
                    value={bookingForm.timeSlot}
                    onChange={e => setBookingForm({ ...bookingForm, timeSlot: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option>06:30 AM - 07:30 AM (Early Fasting Slot)</option>
                    <option>07:30 AM - 08:30 AM (Fasting Slot)</option>
                    <option>08:30 AM - 09:30 AM (Fasting Slot)</option>
                    <option>04:00 PM - 05:30 PM (Non-Fasting Slot)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Home Collection Address</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.address}
                    onChange={e => setBookingForm({ ...bookingForm, address: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-green-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contact Phone Number</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.contactNumber}
                    onChange={e => setBookingForm({ ...bookingForm, contactNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-green-400"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary-green"
                  >
                    Confirm Home Booking ({selectedLab?.price})
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
