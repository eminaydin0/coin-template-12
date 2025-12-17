import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Shield, 
  Users, 
  ShoppingCart, 
  Truck,
  Home,
  ChevronRight,
  FileText as FileTextIcon,
  Sparkles
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useWebsite } from '../context/WebsiteContext';
import SEOHead from '../components/SEOHead';
import { getContractDetail } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import CommonBackground from '../components/CommonBackground';
import CallToActionSection from '../components/CallToActionSection';

const ContractPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { websiteData, loading } = useWebsite();
  const [contractDetail, setContractDetail] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(true);

  // Find the contract by slug
  const contract = websiteData?.contracts?.find(c => c.slug === slug);

  // Fetch contract detail
  useEffect(() => {
    const fetchContractDetail = async () => {
      if (!slug) return;
      
      try {
        setDetailLoading(true);
        const response = await getContractDetail(slug);
        console.log('Contract Detail Response:', response.data);
        setContractDetail(response.data);
      } catch (error) {
        console.error('Error fetching contract detail:', error);
      } finally {
        setDetailLoading(false);
      }
    };

    fetchContractDetail();
  }, [slug]);

  // Get icon based on contract type
  const getContractIcon = (contractName: string) => {
    if (contractName.includes('Gizlilik')) {
      return Shield;
    } else if (contractName.includes('Satış')) {
      return ShoppingCart;
    } else if (contractName.includes('Teslimat')) {
      return Truck;
    } else if (contractName.includes('Üyelik')) {
      return Users;
    } else {
      return FileText;
    }
  };

  if (loading || detailLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden">
        <CommonBackground />
        <LoadingSpinner 
          size="xl" 
          text="Sözleşme Yükleniyor..." 
          variant="gaming" 
        />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen pt-20 relative overflow-hidden gaming-scrollbar">
        <SEOHead />
        <CommonBackground />
        
        <div className="w-full relative z-10">
          {/* Header Section - CategoryDetailPage Stili */}
          <div className="w-full mb-10 px-4 sm:px-6 lg:px-8">
            <div className="w-full">
              <div 
                className="rounded-2xl p-8 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
                  border: '1px solid rgba(75, 85, 99, 0.3)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                }}
              >
                {/* Breadcrumb */}
                <div className="flex items-center flex-wrap gap-2 text-sm mb-6 relative z-10">
                  <Link 
                    to="/" 
                    className="flex items-center gap-1.5 text-gray-400 hover:text-orange-400 transition-colors group"
                  >
                    <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>Ana Sayfa</span>
                  </Link>
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                  <span className="text-orange-300 font-semibold">Sözleşme</span>
                </div>

                {/* Title Section */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div 
                        className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(234, 88, 12, 0.15) 100%)',
                          border: '1px solid rgba(249, 115, 22, 0.3)',
                          boxShadow: '0 8px 32px rgba(249, 115, 22, 0.15)',
                        }}
                      >
                        <FileTextIcon className="h-6 w-6 text-orange-400" />
                      </div>
                    </div>
                    
                    <div>
                      <h1 className="text-2xl font-black text-white tracking-tight mb-1">
                        Sözleşme
                      </h1>
                      <p className="text-gray-400 text-sm font-medium">
                        Yasal sözleşme ve şartlar
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Empty State */}
          <section className="relative py-4">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="w-full">
                <div 
                  className="text-center py-24 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
                    border: '1px solid rgba(75, 85, 99, 0.3)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center mx-auto mb-6">
                    <FileTextIcon className="h-12 w-12 text-orange-400/60" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-3">
                    Sözleşme bulunamadı
                  </h3>
                  <p className="text-gray-400 text-lg mb-8">Aradığınız sözleşme mevcut değil.</p>
                  
                  <Link 
                    to="/" 
                    className="inline-flex items-center gap-2 px-8 py-4 font-bold text-black rounded-xl bg-gradient-to-r from-orange-400 via-orange-300 to-orange-400 shadow-[0_0_40px_rgba(249,115,22,0.5)] hover:shadow-[0_0_60px_rgba(249,115,22,0.7)] transition-all"
                  >
                    <span>ANA SAYFAYA DÖN</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  const IconComponent = getContractIcon(contract.name);

  return (
    <div className="min-h-screen pt-20 relative overflow-hidden gaming-scrollbar">
      <SEOHead />
      
      {/* Common Background */}
      <CommonBackground />

      {/* Background Glow */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full relative z-10">
        {/* Header Section - CategoryDetailPage Stili */}
        <div className="w-full mb-10 px-4 sm:px-6 lg:px-8">
          <div className="w-full">
            <div 
              className="rounded-2xl p-8 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
                border: '1px solid rgba(75, 85, 99, 0.3)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              }}
            >
              {/* Breadcrumb */}
              <div className="flex items-center flex-wrap gap-2 text-sm mb-6 relative z-10">
                <Link 
                  to="/" 
                  className="flex items-center gap-1.5 text-gray-400 hover:text-orange-400 transition-colors group"
                >
                  <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Ana Sayfa</span>
                </Link>
                <ChevronRight className="h-4 w-4 text-gray-600" />
                <span className="text-orange-300 font-semibold">{contract.name}</span>
              </div>

              {/* Title Section */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(234, 88, 12, 0.15) 100%)',
                        border: '1px solid rgba(249, 115, 22, 0.3)',
                        boxShadow: '0 8px 32px rgba(249, 115, 22, 0.15)',
                      }}
                    >
                      <IconComponent className="h-6 w-6 text-orange-400" />
                    </div>
                  </div>
                  
                  <div>
                    <h1 className="text-2xl font-black text-white tracking-tight mb-1">
                      {contract.name}
                    </h1>
                    <p className="text-gray-400 text-sm font-medium">
                      Yasal sözleşme detayları
                    </p>
                  </div>
                </div>

                {/* Stats Badge */}
                <div className="flex items-center gap-3">
                  <div
                    className="px-4 py-2 rounded-xl flex items-center gap-2"
                    style={{
                      background: 'rgba(249, 115, 22, 0.15)',
                      border: '1px solid rgba(249, 115, 22, 0.3)',
                    }}
                  >
                    <Sparkles className="h-4 w-4 text-orange-400" />
                    <span className="text-orange-300 text-sm font-bold">
                      YASAL SÖZLEŞME
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contract Content Section */}
        <section className="relative py-4">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="w-full">
              <div 
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
                  border: '1px solid rgba(75, 85, 99, 0.3)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                }}
              >
                <div className="p-6 sm:p-8 lg:p-10">
                  {/* Contract Header */}
                  <div className="flex items-center gap-4 mb-8 pb-6 border-b relative" style={{ borderColor: 'rgba(75, 85, 99, 0.3)' }}>
                    <div 
                      className="w-14 h-14 flex items-center justify-center rounded-2xl flex-shrink-0 relative overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(234, 88, 12, 0.15) 100%)',
                        border: '1px solid rgba(249, 115, 22, 0.3)',
                        boxShadow: '0 8px 32px rgba(249, 115, 22, 0.15)',
                      }}
                    >
                      <IconComponent className="h-7 w-7 text-orange-400 relative z-10" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white mb-1">
                        {contractDetail?.name || contract.name}
                      </h2>
                      <p className="text-gray-400 text-sm font-medium">Yasal sözleşme detayları ve şartlar</p>
                    </div>
                  </div>
                
                  {/* Contract Text Content */}
                  {contractDetail?.text ? (
                    <div 
                      className="space-y-6 text-gray-300 prose prose-invert max-w-none prose-headings:text-white prose-headings:font-bold prose-p:text-gray-300 prose-a:text-orange-300 prose-a:no-underline hover:prose-a:text-orange-200 prose-strong:text-white prose-code:text-orange-300 prose-pre:bg-gray-900 prose-pre:border prose-pre:border-orange-400/20 prose-li:text-gray-300"
                      dangerouslySetInnerHTML={{ __html: contractDetail.text }}
                      style={{
                        '--tw-prose-body': '#d1d5db',
                        '--tw-prose-headings': '#ffffff',
                        '--tw-prose-links': '#fb923c',
                        '--tw-prose-bold': '#ffffff',
                        '--tw-prose-counters': '#9ca3af',
                        '--tw-prose-bullets': '#fb923c',
                        '--tw-prose-hr': '#4b5563',
                        '--tw-prose-quotes': '#f3f4f6',
                        '--tw-prose-quote-borders': '#fb923c',
                        '--tw-prose-captions': '#9ca3af',
                        '--tw-prose-code': '#fb923c',
                        '--tw-prose-pre-code': '#d1d5db',
                        '--tw-prose-pre-bg': '#111827',
                        '--tw-prose-th-borders': '#4b5563',
                        '--tw-prose-td-borders': '#4b5563'
                      } as React.CSSProperties}
                    />
                  ) : (
                    <div 
                      className="text-center py-12 rounded-xl"
                      style={{
                        background: 'rgba(249, 115, 22, 0.1)',
                        border: '1px solid rgba(249, 115, 22, 0.2)',
                      }}
                    >
                      <FileTextIcon className="h-12 w-12 text-orange-400/60 mx-auto mb-4" />
                      <p className="text-gray-400 text-base">Sözleşme içeriği yüklenemedi.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <CallToActionSection />
      </div>
    </div>
  );
};

export default ContractPage;





