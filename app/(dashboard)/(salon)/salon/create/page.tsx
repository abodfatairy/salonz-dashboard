"use client";

import React, { useState } from "react";

type FormData = {
  otpid: string;
  firstName: string;
  lastName: string;
  salonName: string;
  payoutPercentage: number;
  dob: string;
  description: string;
  city: string;
  region: string;
  address: string;
  hasHijabSection: boolean;
  howManySections: number;
  hasHomeService: boolean;
  hasSalonSite: boolean;
  startTime: string;
  endTime: string;
  homeServiceStartTime: string;
  homeServiceEndTime: string;
  dayOff: number;
  latitude: number;
  longitude: number;
  password: string;
};

export default function CreateSalonPage() {
  const [form, setForm] = useState<FormData>({
    otpid: "",
    firstName: "",
    lastName: "",
    salonName: "",
    payoutPercentage: 100,
    dob: "",
    description: "",
    city: "",
    region: "",
    address: "",
    hasHijabSection: false,
    howManySections: 1,
    hasHomeService: false,
    hasSalonSite: false,
    startTime: "",
    endTime: "",
    homeServiceStartTime: "",
    homeServiceEndTime: "",
    dayOff: 0,
    latitude: 0,
    longitude: 0,
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumber = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleBoolean = (name: string, value: boolean) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    // API Call...
  };

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4 md:p-8 font-sans'>
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-5xl bg-white shadow-xl rounded-2xl overflow-hidden'
      >
        {/* Header */}
        <div className='bg-slate-900 px-8 py-6 text-white'>
          <h1 className='text-2xl font-bold'>Create New Salon</h1>
          <p className='text-slate-300 text-sm mt-1'>
            Fill in the details below to register a new salon in the system.
          </p>
        </div>

        <div className='p-8 space-y-10'>
          {/* Section: Owner Information */}
          <Section title='1. Owner Information'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <Input
                label='First Name'
                name='firstName'
                value={form.firstName}
                onChange={handleChange}
                placeholder='John'
              />
              <Input
                label='Last Name'
                name='lastName'
                value={form.lastName}
                onChange={handleChange}
                placeholder='Doe'
              />
              <Input
                label='Date of Birth'
                name='dob'
                type='date'
                value={form.dob}
                onChange={handleChange}
              />
              <Input
                label='Password'
                name='password'
                type='password'
                value={form.password}
                onChange={handleChange}
                placeholder='••••••••'
              />
            </div>
          </Section>

          <Divider />

          {/* Section: Salon Details */}
          <Section title='2. Salon Details'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <Input
                label='Salon Name'
                name='salonName'
                value={form.salonName}
                onChange={handleChange}
                placeholder='Elegant Cuts'
              />
              <Input
                label='Payout Percentage (%)'
                name='payoutPercentage'
                type='number'
                value={String(form.payoutPercentage)}
                onChange={(e) =>
                  handleNumber("payoutPercentage", e.target.value)
                }
              />
              <Input
                label='Number of Sections'
                name='howManySections'
                type='number'
                value={String(form.howManySections)}
                onChange={(e) =>
                  handleNumber("howManySections", e.target.value)
                }
              />

              <div className='md:col-span-2 flex flex-col gap-1.5'>
                <label className='text-sm font-semibold text-gray-700'>
                  Description
                </label>
                <textarea
                  name='description'
                  value={form.description}
                  onChange={handleChange}
                  placeholder='Tell us about the salon...'
                  className='border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 bg-gray-50 focus:bg-white transition-all h-28 resize-none'
                />
              </div>
            </div>
          </Section>

          <Divider />

          {/* Section: Location */}
          <Section title='3. Location Info'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <Input
                label='City'
                name='city'
                value={form.city}
                onChange={handleChange}
                placeholder='Dubai'
              />
              <Input
                label='Region'
                name='region'
                value={form.region}
                onChange={handleChange}
                placeholder='Downtown'
              />
              <div className='md:col-span-2'>
                <Input
                  label='Full Address'
                  name='address'
                  value={form.address}
                  onChange={handleChange}
                  placeholder='Street name, Building No.'
                />
              </div>
              <Input
                label='Latitude'
                name='latitude'
                type='number'
                step='any'
                value={String(form.latitude)}
                onChange={(e) => handleNumber("latitude", e.target.value)}
                placeholder='25.2048'
              />
              <Input
                label='Longitude'
                name='longitude'
                type='number'
                step='any'
                value={String(form.longitude)}
                onChange={(e) => handleNumber("longitude", e.target.value)}
                placeholder='55.2708'
              />
            </div>
          </Section>

          <Divider />

          {/* Section: Operating Hours */}
          <Section title='4. Operating Hours'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <Input
                label='Start Time'
                name='startTime'
                type='time'
                value={form.startTime}
                onChange={handleChange}
              />
              <Input
                label='End Time'
                name='endTime'
                type='time'
                value={form.endTime}
                onChange={handleChange}
              />

              {form.hasHomeService && (
                <>
                  <Input
                    label='Home Service Start Time'
                    name='homeServiceStartTime'
                    type='time'
                    value={form.homeServiceStartTime}
                    onChange={handleChange}
                  />
                  <Input
                    label='Home Service End Time'
                    name='homeServiceEndTime'
                    type='time'
                    value={form.homeServiceEndTime}
                    onChange={handleChange}
                  />
                </>
              )}
            </div>
          </Section>

          <Divider />

          {/* Section: Features & Settings */}
          <Section title='5. Features & Settings'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <Toggle
                label='Hijab Section'
                description='Private area available'
                value={form.hasHijabSection}
                onChange={(v) => handleBoolean("hasHijabSection", v)}
              />
              <Toggle
                label='Home Service'
                description='Provides service at home'
                value={form.hasHomeService}
                onChange={(v) => handleBoolean("hasHomeService", v)}
              />
              <Toggle
                label='Salon Site'
                description='Has a physical location'
                value={form.hasSalonSite}
                onChange={(v) => handleBoolean("hasSalonSite", v)}
              />
            </div>
          </Section>
        </div>

        {/* Footer / Submit */}
        <div className='bg-gray-50 p-6 md:p-8 border-t flex justify-end'>
          <button
            type='submit'
            className='w-full md:w-auto px-8 py-3 bg-slate-900 text-white font-medium rounded-xl shadow-lg hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200'
          >
            Create Salon
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------------- UI Components ---------------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className='text-lg font-bold text-slate-800 mb-4'>{title}</h2>
      {children}
    </div>
  );
}

function Divider() {
  return <div className='w-full h-px bg-gray-200 my-2'></div>;
}

function Input({ label, type = "text", ...props }: any) {
  return (
    <div className='flex flex-col gap-1.5'>
      <label className='text-sm font-semibold text-gray-700'>{label}</label>
      <input
        type={type}
        {...props}
        className='border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-slate-800 bg-gray-50 focus:bg-white transition-all w-full'
      />
    </div>
  );
}

function Toggle({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      onClick={() => onChange(!value)}
      className='flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors'
    >
      <div className='pr-4'>
        <p className='font-semibold text-sm text-gray-800'>{label}</p>
        {description && (
          <p className='text-xs text-gray-500 mt-0.5'>{description}</p>
        )}
      </div>
      <button
        type='button'
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          value ? "bg-slate-900" : "bg-gray-300"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            value ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
