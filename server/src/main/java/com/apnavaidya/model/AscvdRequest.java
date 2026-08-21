package com.apnavaidya.model;

public class AscvdRequest {
    private int age;
    private String gender;
    private double totalChol;
    private double hdlChol;
    private double systolicBp;
    private boolean smoker;
    private boolean diabetic;

    public AscvdRequest() {}

    public int getAge() { return age > 0 ? age : 40; }
    public void setAge(int age) { this.age = age; }

    public String getGender() { return gender != null ? gender : "Male"; }
    public void setGender(String gender) { this.gender = gender; }

    public double getTotalChol() { return totalChol > 0 ? totalChol : 200; }
    public void setTotalChol(double totalChol) { this.totalChol = totalChol; }

    public double getHdlChol() { return hdlChol > 0 ? hdlChol : 50; }
    public void setHdlChol(double hdlChol) { this.hdlChol = hdlChol; }

    public double getSystolicBp() { return systolicBp > 0 ? systolicBp : 120; }
    public void setSystolicBp(double systolicBp) { this.systolicBp = systolicBp; }

    public boolean isSmoker() { return smoker; }
    public void setSmoker(boolean smoker) { this.smoker = smoker; }

    public boolean isDiabetic() { return diabetic; }
    public void setDiabetic(boolean diabetic) { this.diabetic = diabetic; }
}
