'use client';

export const FooterComponent = () => {
  return (
    <footer className="w-full py-4 text-center">
      <div className="text-sm dark:text-gray-400 text-gray-600">
        Made with love ❤️ by{' '}
        <a
          href="https://noahhendy.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#048FCC] hover:text-[#F8AB0C] hover:underline transition-colors font-medium"
        >
          Noah Hendy
        </a>
      </div>
    </footer>
  );
};
