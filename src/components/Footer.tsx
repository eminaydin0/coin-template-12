import { Link } from 'react-router-dom';
import { useWebsite } from '../context/WebsiteContext';

const Footer = () => {
  const { websiteData, getInfoValue } = useWebsite();

  return (
    <footer className="relative bg-black border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1 - Brand Info */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                {getInfoValue('TITLE')}
              </h2>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">
                Copyright © {new Date().getFullYear()}
              </p>
            </div>
          </div>

          {/* Column 2 - Sözleşmeler */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white">
              Sözleşmeler
            </h3>
            <ul className="space-y-2">
              {websiteData?.contracts?.map((contract) => (
                <li key={contract.id}>
                  <Link
                    to={`/sozlesme/${contract.slug}`}
                    className="text-gray-400 hover:text-white transition-colors text-sm block"
                  >
                    {contract.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Müşteri Hizmetleri */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white">
              Müşteri Hizmetleri
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/iletisim"
                  className="text-gray-400 hover:text-white transition-colors text-sm block"
                >
                  İletişim & Ulaşım
                </Link>
              </li>
              <li>
                <Link
                  to="/banka-hesaplari"
                  className="text-gray-400 hover:text-white transition-colors text-sm block"
                >
                  Banka Hesapları
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Satış Hizmetleri */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white">
              Satış Hizmetleri
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/toplu-satin-alim"
                  className="text-gray-400 hover:text-white transition-colors text-sm block"
                >
                  Toplu Satın Alım
                </Link>
              </li>
              <li>
                <Link
                  to="/geri-iade"
                  className="text-gray-400 hover:text-white transition-colors text-sm block"
                >
                  Geri İade
                </Link>
              </li>
              <li>
                <Link
                  to="/canli-destek"
                  className="text-gray-400 hover:text-white transition-colors text-sm block"
                >
                  Canlı Destek
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              <p>© {new Date().getFullYear()} {getInfoValue('TITLE')}. Tüm hakları saklıdır.</p>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Gizlilik
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Kullanım Şartları
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Çerezler
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
