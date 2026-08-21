package com.apnavaidya.model;

public class VascularRequest {
    private int chronologicalAge;
    private double systolicBp;
    private double diastolicBp;
    private double totalChol;
    private double hdlChol;
    private int restingHr;
    private boolean smoker;

    public VascularRequest() {}

    public int getChronologicalAge() { return chronologicalAge > 0 ? chronologicalAge : 32; }
    public void setChronologicalAge(int chronologicalAge) { this.chronologicalAge = chronologicalAge; }

    public double getSystolicBp() { return systolicBp > 0 ? systolicBp : 124; }
    public void setSystolicBp(double systolicBp) { this.systolicBp = systolicBp; }

    public double getDiastolicBp() { return diastolicBp > 0 ? diastolicBp : 82; }
    public void setDiastolicBp(double diastolicBp) { this.diastolicBp = diastolicBp; }

    public double getTotalChol() { return totalChol > 0 ? totalChol : 228; }
    public void setTotalChol(double totalChol) { this.totalChol = totalChol; }

    public double getHdlChol() { return hdlChol > 0 ? hdlChol : 52; }
    public void setHdlChol(double hdlChol) { this.hdlChol = hdlChol; }

    public int getRestingHr() { return restingHr > 0 ? restingHr : 68; }
    public void setRestingHr(int restingHr) { this.restingHr = restingHr; }

    public boolean isSmoker() { return smoker; }
    public void setSmoker(boolean smoker) { this.smoker = smoker; }
}
