import { Helmet } from "react-helmet";
import Hero from "@/components/Hero";
import FeaturedPackages from "@/components/FeaturedPackages";
import PopularDestinations from "@/components/PopularDestinations";
import SpecialOffers from "@/components/SpecialOffers";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Wanderlust - Discover Your Dream Destination</title>
        <meta name="description" content="Explore handpicked travel packages and embark on unforgettable adventures around the world with Wanderlust Travel & Tours." />
        <meta property="og:title" content="Wanderlust - Discover Your Dream Destination" />
        <meta property="og:description" content="Explore handpicked travel packages and embark on unforgettable adventures around the world with Wanderlust Travel & Tours." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Hero />
      <FeaturedPackages />
      <PopularDestinations />
      <SpecialOffers />
      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
    </>
  );
};

export default Home;
