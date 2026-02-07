import React, { useState } from 'react';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
    id: number;
    clientName: string;
    caseType: string;
    testimonial: string;
    rating: number;
    initials: string;
    color: string;
}

const TestimonialsSection: React.FC = () => {
    const testimonials: Testimonial[] = [
        {
            id: 1,
            clientName: "Sarah Johnson",
            caseType: "Family Law - Custody Case",
            testimonial: "Wakili's legal team was incredibly professional and compassionate during my custody case. They fought tirelessly for my family's rights and the outcome exceeded my expectations. Highly recommended!",
            rating: 5,
            initials: "SJ",
            color: "bg-blue-500"
        },
        {
            id: 2,
            clientName: "Peter Mwangi",
            caseType: "Employment Dispute",
            testimonial: "I was wrongfully terminated from my job and Wakili helped me navigate the legal process. Their expertise in employment law was evident, and they secured a fair settlement for me.",
            rating: 5,
            initials: "PM",
            color: "bg-green-500"
        },
        {
            id: 3,
            clientName: "Grace Kipchoge",
            caseType: "Business Contract Review",
            testimonial: "As a business owner, I needed reliable legal advice. Wakili reviewed all my contracts and identified potential issues I hadn't noticed. Their proactive approach saved me thousands.",
            rating: 5,
            initials: "GK",
            color: "bg-purple-500"
        },
        {
            id: 4,
            clientName: "David Okafor",
            caseType: "Property Law & Registration",
            testimonial: "The team at Wakili made my property registration process smooth and hassle-free. Their attention to detail and transparent communication made all the difference.",
            rating: 5,
            initials: "DO",
            color: "bg-orange-500"
        },
        {
            id: 5,
            clientName: "Amina Hassan",
            caseType: "Immigration & Documentation",
            testimonial: "I was anxious about my immigration case, but Wakili's experienced lawyers guided me through every step. Their compassion and expertise gave me confidence throughout the process.",
            rating: 5,
            initials: "AH",
            color: "bg-pink-500"
        },
        {
            id: 6,
            clientName: "James Kariuki",
            caseType: "Intellectual Property Protection",
            testimonial: "Wakili helped me protect my business's intellectual property. Their strategic approach ensured my trademarks and patents were properly registered and defended.",
            rating: 5,
            initials: "JK",
            color: "bg-red-500"
        }
    ];

    const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial>(testimonials[0]);

    return (
        <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center mb-4">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                                />
                            ))}
                        </div>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        Success Stories from Our Clients
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Real testimonials from clients we've helped navigate the complexities of Kenya's legal system
                    </p>
                </div>

                {/* Main Testimonial Display */}
                <div className="mb-12 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 md:p-12">
                    <div className="flex items-start gap-4 mb-6">
                        <Quote className="w-8 h-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-lg md:text-2xl text-slate-700 dark:text-slate-200 font-medium leading-relaxed mb-6">
                                "{selectedTestimonial.testimonial}"
                            </p>

                            {/* Rating */}
                            <div className="flex gap-2 mb-4">
                                {[...Array(selectedTestimonial.rating)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                                    />
                                ))}
                            </div>

                            {/* Client Info */}
                            <div className="flex items-center gap-4">
                                <div className={`${selectedTestimonial.color} w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                                    {selectedTestimonial.initials}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white text-lg">
                                        {selectedTestimonial.clientName}
                                    </p>
                                    <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                                        {selectedTestimonial.caseType}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial) => (
                        <button
                            key={testimonial.id}
                            onClick={() => setSelectedTestimonial(testimonial)}
                            className={`p-6 rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer text-left ${
                                selectedTestimonial.id === testimonial.id
                                    ? 'bg-purple-600 dark:bg-purple-700 text-white shadow-xl ring-2 ring-purple-400 dark:ring-purple-500'
                                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 shadow-md hover:shadow-lg'
                            }`}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`${testimonial.color} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                                    {testimonial.initials}
                                </div>
                                <div>
                                    <p className={`font-bold text-sm ${selectedTestimonial.id === testimonial.id ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                        {testimonial.clientName}
                                    </p>
                                    <p className={`text-xs ${selectedTestimonial.id === testimonial.id ? 'text-purple-100 dark:text-purple-200' : 'text-slate-600 dark:text-slate-400'}`}>
                                        {testimonial.caseType}
                                    </p>
                                </div>
                            </div>

                            {/* Stars */}
                            <div className="flex gap-1 mb-3">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 fill-current ${
                                            selectedTestimonial.id === testimonial.id
                                                ? 'text-yellow-300'
                                                : 'text-yellow-400'
                                        }`}
                                    />
                                ))}
                            </div>

                            {/* Preview text */}
                            <p className={`text-sm line-clamp-3 ${selectedTestimonial.id === testimonial.id ? 'text-purple-50 dark:text-purple-100' : 'text-slate-600 dark:text-slate-400'}`}>
                                {testimonial.testimonial}
                            </p>
                        </button>
                    ))}
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-12 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-center">
                        <div className="text-4xl md:text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                            500+
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">
                            Satisfied Clients
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl md:text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                            98%
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">
                            Success Rate
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl md:text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                            4.9/5
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">
                            Average Rating
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
