"use client"
import { Button, Carousel } from 'antd';
import { CarouselRef } from 'antd/es/carousel';
import Image from 'next/image';
import { ReactNode, useEffect, useRef } from 'react';

function CustomCarousel({
  children,
  className,
  navigation,
  page
}: Readonly<{
  children: ReactNode;
  className?: string;
  navigation?: boolean;
  page?: number;
}>) {
  const carouselRef = useRef<CarouselRef | null>(null);

  const handleGoPrevSlider = () => {
    carouselRef.current?.prev();
  };
  const handleGoNextSlider = () => {
    carouselRef.current?.next();
  };

  const PrevButton = ({ onClick }: { onClick: () => void }) => (
    <Button  className="border border-transparent hover:border-primary" onClick={onClick}>
      <Image width={24} height={24} alt="" src="/icon-arrow-left.svg" />
    </Button>
  );
  const NextButton = ({ onClick }: { onClick: () => void }) => (
    <Button className="border border-transparent hover:border-primary" onClick={onClick}>
      <Image width={24} height={24} alt="" src="/icon-arrow-right.svg" />
    </Button>
  );

  useEffect(() => {

  }, []);

  useEffect(() => {
    if(page || page === 0) {
      carouselRef.current?.goTo(page, false)
    }
  }, [page]);

  return navigation ? (
    <div className={className}>
      <Carousel
        ref={carouselRef}
        infinite={false}
        slidesToShow={1}
        slidesToScroll={1}
        adaptiveHeight={true}
        swipeToSlide={true}
        style={{ minWidth: 0, minHeight: 0 }}
        nextArrow={<PrevButton onClick={handleGoPrevSlider} />}
        prevArrow={<NextButton onClick={handleGoNextSlider} />}
        customPaging={() => {
          return (
            <a>
              <div className="dot w-2 h-2 rounded-full bg-primary overflow-hidden" />
            </a>
          );
        }}
      >
        {children}
      </Carousel>
      <div className="flex items-center justify-between mt-3">
        <PrevButton onClick={handleGoPrevSlider} />
        <NextButton onClick={handleGoNextSlider} />
      </div>
    </div>
  ) : (
    <div className={className}>
      <div className="rounded-lg overflow-hidden">{children}</div>
    </div>
  );
}

export default CustomCarousel;
