package com.apnavaidya.model;

public class LongevityRequest {
    private int chronologicalAge;
    private double systolicBp;
    private double totalChol;
    private double hdlChol;
    private double hba1c;
    private double fastingGlucose;
    private int restingHr;
    private int weeklyExerciseMins;
    private double sleepHours;
    private boolean smoker;

    public LongevityRequest() {}

    public int getChronologicalAge() { return chronologicalAge; }
    public void setChronologicalAge(int chronologicalAge) { this.chronologicalAge = chronologicalAge; }

    public double getSystolicBp() { return systolicBp; }
    public void setSystolicBp(double systolicBp) { this.systolicBp = systolicBp; }

    public double getTotalChol() { return totalChol; }
    public void setTotalChol(double totalChol) { this.totalChol = totalChol; }

    public double getHdlChol() { return hdlChol; }
    public void setHdlChol(double hdlChol) { this.hdlChol = hdlChol; }

    public double getHba1c() { return hba1c; }
    public void setHba1c(double hba1c) { this.hba1c = hba1c; }

    public double getFastingGlucose() { return fastingGlucose; }
    public void setFastingGlucose(double fastingGlucose) { this.fastingGlucose = fastingGlucose; }

    public int getRestingHr() { return restingHr; }
    public void setRestingHr(int restingHr) { this.restingHr = restingHr; }

    public int getWeeklyExerciseMins() { return weeklyExerciseMins; }
    public void setWeeklyExerciseMins(int weeklyExerciseMins) { this.weeklyExerciseMins = weeklyExerciseMins; }

    public double getSleepHours() { return sleepHours; }
    public void setSleepHours(double sleepHours) { this.sleepHours = sleepHours; }

    public boolean isSmoker() { return smoker; }
    public void setSmoker(boolean smoker) { this.smoker = smoker; }
}
