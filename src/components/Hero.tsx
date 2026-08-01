import heroBg from "../assets/hero-background.jpg";
import Header from "./Header";

const Hero = () => {
    return (
        <div className="relative min-h-screen flex flex-col overflow-hidden w-full">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-900/20 to-black" />
            
            {/* Background Image with Enhanced Effects */}
            <img
                src={heroBg}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover opacity-40"
            />

            {/* Animated Overlay */}
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black pointer-events-none" />
            
            {/* Decorative Elements */}
            <div aria-hidden="true" className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            <div aria-hidden="true" className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />

            <Header />

            {/* Hero Content */}
            <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-20">
                <div className="text-center max-w-5xl space-y-8 animate-fade-in">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/15 transition-colors">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        Watch Now. Anytime. Anywhere.
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-white space-y-2">
                        <span className="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent drop-shadow-lg">
                            Unlimited movies,
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-red-400 via-red-500 to-orange-400 bg-clip-text text-transparent drop-shadow-lg">
                            TV shows, and more
                        </span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Experience premium entertainment with our vast library. Watch your favorites anywhere, anytime.
                    </p>

                    {/* Pricing Badge */}
                    <div className="text-2xl md:text-3xl font-bold text-white">
                        Starting at <span className="text-red-500">$7.99</span>
                        <p className="text-base md:text-lg text-gray-400 font-normal mt-2">Cancel anytime, no commitment</p>
                    </div>

                    {/* Email Input and Button */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch max-w-2xl mx-auto pt-4">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-6 py-4 text-white placeholder-gray-400 text-base focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300 shadow-lg"
                        />
                        <button 
                            type="button"
                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-lg text-lg font-bold whitespace-nowrap transition-all duration-300 flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:scale-105 transform"
                        >
                            Get Started
                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="pt-6 flex justify-center gap-8 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Free trial for 7 days
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            No credit card required
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
