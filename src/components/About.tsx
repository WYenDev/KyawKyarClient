import React from 'react';
import { Award, Shield, Users, Clock, CheckCircle } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-16 xl:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid xl:grid-cols-2 gap-12 xl:gap-16 items-center">
          
          {/* Image Collage */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img 
                src="https://images.unsplash.com/photo-1554224155-16954405a255?q=80&w=800&auto=format&fit=crop"
                alt="Showroom Interior"
                className="rounded-none w-full h-auto object-cover aspect-[4/5]"
              />
              <img 
                src="https://images.unsplash.com/photo-1617854818583-09e7f077a156?q=80&w=800&auto=format&fit=crop"
                alt="Our Team"
                className="rounded-none w-full h-auto object-cover aspect-square"
              />
            </div>
            <div className="space-y-4 mt-8">
              <img 
                src="https://images.unsplash.com/photo-1517999144091-3d9dca6d1649?q=80&w=800&auto=format&fit=crop"
                alt="Customer Service"
                className="rounded-none w-full h-auto object-cover aspect-square"
              />
              <img 
                src="https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Luxury Car"
                className="rounded-none w-full h-auto object-cover aspect-[4/5]"
              />
            </div>
          </div>

          {/* Text Content */}
          <div>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 leading-tight">
              Myanmar's Most Trusted 
              <span className="text-indigo-600"> Pre-Owned Car Dealer</span>
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              For over 15 years, Kyaw Kyar has been the leading destination for quality used cars. 
              We've built our reputation on trust, transparency, and exceptional customer service, 
              helping thousands of families find their perfect vehicle.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Award className="h-5 w-5 text-indigo-700" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Quality Assured</div>
                  <div className="text-sm text-slate-500">Every car inspected</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Warranty Included</div>
                  <div className="text-sm text-slate-500">6-month guarantee</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-orange-700" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Expert Team</div>
                  <div className="text-sm text-slate-500">Professional service</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-purple-700" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Fast Process</div>
                  <div className="text-sm text-slate-500">Quick paperwork</div>
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t border-slate-200 pt-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-slate-700">Largest inventory in Myanmar</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-slate-700">Transparent pricing with no hidden fees</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-slate-700">Financing options available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;