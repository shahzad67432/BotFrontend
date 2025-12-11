"use client"
import { ArrowRight, Dock, Menu, User, X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

export const HeaderPage = () => {
    const [jwt, setJwt] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        setJwt(localStorage.getItem("auth_token"));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        window.location.href = '/login';
    };

    const navItems = [
        { label: 'Profile', href: '/profile', logo: User },
        { label: 'Documentation', href: '/documentation', logo: Dock },
    ];

    return (
        <>
            <div className="flex justify-center items-center w-full px-4">
                {/* Desktop Navigation */}
                <div className="hidden md:flex justify-between px-6 w-full max-w-4xl py-3 items-center border-t-2  border-b-2 rounded-full border-[#e086f8] mt-6 bg-white/80 backdrop-blur-md shadow-lg shadow-purple-200/50">
                    <Image 
                        className="cursor-pointer hover:scale-110 transition-transform" 
                        onClick={() => {window.location.href = '/';}} 
                        src="/logo.png" 
                        alt="Logo" 
                        width={40} 
                        height={40} 
                    />
                    
                    <div className="flex text-center items-center gap-2">
                        {navItems.map((item) => {
                          const Icon =  item.logo;
                        return (
                            <button
                                key={item.label}
                                className="px-4 py-2 rounded-xl bg-gradient-to-b from-white to-gray-50 border-2 border-gray-200 shadow-[0_3px_0_0_rgba(226,134,248,0.3)] hover:shadow-[0_2px_0_0_rgba(226,134,248,0.3)] hover:translate-y-[1px] active:shadow-none active:translate-y-[3px] transition-all duration-100 font-medium text-gray-700 hover:text-[#cc39f5] "
                                onClick={() => {window.location.href = item.href}}
                            >
                                <Icon/>
                            </button>
                        )})}
                        
                        {jwt ? (
                            <button 
                                className="w-full px-4 py-3 rounded-xl bg-[#cc39f5] border-2 border-[#9010c0] shadow-[0_4px_0_0_rgba(144,16,192,0.8)] hover:shadow-[0_2px_0_0_rgba(144,16,192,0.8)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all duration-100 font-semibold text-white text-sm flex items-center gap-2"
                                onClick={handleLogout}
                            >
                                Logout
                                <ArrowRight size={16} />
                            </button>
                        ) : (
                            <button 
                                className="px-5 py-2 rounded-xl bg-gradient-to-b from-[#cc39f5] to-[#b020e0] border-2 border-[#9010c0] shadow-[0_4px_0_0_rgba(144,16,192,0.8)] hover:shadow-[0_2px_0_0_rgba(144,16,192,0.8)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all duration-100 font-semibold text-white flex items-center gap-2"
                                onClick={() => {window.location.href = '/login'}}
                            >
                                Login
                                <ArrowRight size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden flex justify-between px-4 w-full py-3 items-center border-2 rounded-full border-[#e086f8] mt-6 bg-white/80 backdrop-blur-md shadow-lg shadow-purple-200/50">
                    <Image 
                        className="cursor-pointer hover:scale-110 transition-transform" 
                        onClick={() => {window.location.href = '/';}} 
                        src="/logo.png" 
                        alt="Logo" 
                        width={32} 
                        height={32} 
                    />
                    
                    <button
                        className="p-2 rounded-xl bg-gradient-to-b from-white to-gray-50 border-2 border-gray-200 shadow-[0_3px_0_0_rgba(226,134,248,0.3)] hover:shadow-[0_2px_0_0_rgba(226,134,248,0.3)] hover:translate-y-[1px] active:shadow-none active:translate-y-[3px] transition-all duration-100 text-[#cc39f5]"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed top-20 left-0 right-0 mx-4 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-[#e086f8] shadow-2xl shadow-purple-300/50 z-50 overflow-hidden animate-in slide-in-from-top duration-200">
                    <div className="flex flex-col p-4 gap-3">
                        {navItems.map((item) => (
                            <button
                                key={item.label}
                                className="w-full px-4 py-3 rounded-xl bg-gradient-to-b from-white to-gray-50 border-2 border-gray-200 shadow-[0_3px_0_0_rgba(226,134,248,0.3)] hover:shadow-[0_2px_0_0_rgba(226,134,248,0.3)] hover:translate-y-[1px] active:shadow-none active:translate-y-[3px] transition-all duration-100 font-medium text-gray-700 hover:text-[#cc39f5] hover:border-[#e086f8] text-left"
                                onClick={() => {
                                    window.location.href = item.href;
                                    setMobileMenuOpen(false);
                                }}
                            >
                                {item.label}
                            </button>
                        ))}
                        
                        <div className="border-t-2 border-gray-200 my-2"></div>
                        
                        {jwt ? (
                            <button 
                                className="w-full px-4 py-3 rounded-xl bg-gradient-to-b from-[#cc39f5] to-[#b020e0] border-2 border-[#9010c0] shadow-[0_4px_0_0_rgba(144,16,192,0.8)] hover:shadow-[0_2px_0_0_rgba(144,16,192,0.8)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all duration-100 font-semibold text-white text-sm flex items-center justify-center gap-2"
                                onClick={() => {
                                    handleLogout();
                                    setMobileMenuOpen(false);
                                }}
                            >
                                Logout
                                <ArrowRight size={16} />
                            </button>
                        ) : (
                            <button 
                                className="w-full px-4 py-3 rounded-xl bg-gradient-to-b from-[#cc39f5] to-[#b020e0] border-2 border-[#9010c0] shadow-[0_4px_0_0_rgba(144,16,192,0.8)] hover:shadow-[0_2px_0_0_rgba(144,16,192,0.8)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all duration-100 font-semibold text-white flex items-center justify-center gap-2"
                                onClick={() => {
                                    window.location.href = '/login';
                                    setMobileMenuOpen(false);
                                }}
                            >
                                Login
                                <ArrowRight size={16} />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Mobile Menu Backdrop */}
            {mobileMenuOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    onClick={() => setMobileMenuOpen(false)}
                ></div>
            )}
        </>
    );
}