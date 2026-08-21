import React, { useState } from 'react';
import { 
  Stethoscope, 
  Star, 
  MapPin, 
  Calendar, 
  Clock, 
  Search, 
  ChevronRight, 
  CheckCircle2, 
  X,
  Sparkles
} from 'lucide-react';
import { DOCTORS_DIRECTORY } from '../../data/doctorsData';

export default function DoctorDirectory({ onGenerateSummary }) {
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const specialties = ['ALL', 'Cardiology', 'Diabetology & Endocrinology', 'Endocrinology & Thyroid Specialist', 'General Internal Medicine'];

  const filteredDoctors = DOCTORS_DIRECTORY.filter(doc => {
    const matchesSpecialty = selectedSpecialty === 'ALL' || doc.specialty === selectedSpecialty;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.hospital.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  const handleConfirmBooking = () => {
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingDoctor(null);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-display">
            Verified Specialist Directory & Hospital Affiliations
          </h3>
          <p className="text-xs text-slate-500">
            Consult accredited clinicians with your auto-generated ApnaVaidya visit dossier.
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[200px] w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search doctors, specialty, hospital..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-green-400"
          />
        </div>
      </div>

      {/* Specialty Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {specialties.map((spec) => (
          <button
            key={spec}
            onClick={() => setSelectedSpecialty(spec)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedSpecialty === spec
                ? 'bg-brand-green-700 text-white border-brand-green-700 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50/50 hover:border-brand-green-300'
            }`}
          >
            {spec === 'ALL' ? 'All Specialties' : spec}
          </button>
        ))}
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="card-white p-5 hover:border-brand-green-300 hover:shadow-soft-green transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base shadow-xs mt-0.5">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                      {doc.name}
                    </h4>
                    <span className="text-[11px] font-semibold text-emerald-800 block">
                      {doc.specialty}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {doc.degrees} • {doc.experience}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 text-xs font-bold text-amber-900">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{doc.rating}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                {doc.bio}
              </p>

              <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {doc.hospital}
                </span>
                <span className="font-extrabold text-slate-900">
                  Fee: {doc.consultationFee}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Next: {doc.nextAvailableSlot}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={onGenerateSummary}
                  className="btn-outline-white text-[11px] py-1.5 px-2.5"
                  title="Prepare visit dossier"
                >
                  <Sparkles className="w-3 h-3 text-brand-pink-500" /> Summary
                </button>
                <button
                  onClick={() => setBookingDoctor(doc)}
                  className="btn-primary-green text-[11px] py-1.5 px-3"
                >
                  Book Slot
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {bookingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            {bookingSuccess ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">Appointment Confirmed!</h3>
                <p className="text-xs text-slate-500">
                  Scheduled with {bookingDoctor.name} for {bookingDoctor.nextAvailableSlot}. Your pre-consultation summary has been generated.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-base font-extrabold text-slate-900">Confirm Appointment</h3>
                  <button onClick={() => setBookingDoctor(null)} className="p-1 text-slate-400 hover:text-slate-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="my-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                  <div className="font-bold text-slate-900">{bookingDoctor.name}</div>
                  <div className="text-emerald-800 font-semibold">{bookingDoctor.specialty}</div>
                  <div className="text-slate-500">{bookingDoctor.hospital}</div>
                  <div className="text-slate-700 font-bold pt-1">Slot: {bookingDoctor.nextAvailableSlot}</div>
                  <div className="text-slate-700 font-bold">Fee: {bookingDoctor.consultationFee}</div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setBookingDoctor(null)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    className="btn-primary-green text-xs"
                  >
                    Confirm Booking
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
