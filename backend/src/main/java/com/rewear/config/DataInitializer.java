package com.rewear.config;

import com.rewear.model.Product;
import com.rewear.model.User;
import com.rewear.repository.ProductRepository;
import com.rewear.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           ProductRepository productRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedProducts();
        System.out.println("✅ ReWear Hub data initialized successfully");
    }

    private void seedUsers() {
        if (userRepository.count() > 0) return;

        User admin = new User();
        admin.setName("Admin User");
        admin.setEmail("admin@rewear.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setPhone("+91-9876543210");
        admin.setRole(User.Role.ADMIN);
        admin.setRewardPoints(500);
        admin.setEnabled(true);

        User demo = new User();
        demo.setName("Demo User");
        demo.setEmail("demo@rewear.com");
        demo.setPassword(passwordEncoder.encode("demo123"));
        demo.setPhone("+91-9876543211");
        demo.setRole(User.Role.USER);
        demo.setRewardPoints(250);
        demo.setEnabled(true);

        userRepository.saveAll(Arrays.asList(admin, demo));
        System.out.println("Seeded 2 users");
    }

    private void seedProducts() {
        if (productRepository.count() > 0) return;

        List<Product> products = Arrays.asList(
            makeProduct("Royal Sherwani Set",
                "Exquisite embroidered sherwani in royal blue with matching dupatta and churidar. Perfect for weddings.",
                "599", "2000", "ethnic", "wedding",
                Arrays.asList("S", "M", "L", "XL"),
                "https://images.unsplash.com/photo-1594938298603-c8148c4b4d8c?w=600&q=80",
                true, true, false, null, null, 4.8, 124),

            makeProduct("Midnight Tuxedo",
                "Classic black tuxedo with silk lapels and gold cufflinks. Perfect for black-tie events.",
                "449", "1500", "formal", "party",
                Arrays.asList("M", "L", "XL"),
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
                true, true, false, null, null, 4.6, 89),

            makeProduct("Bandhgala Suit",
                "SRK-inspired Bandhgala suit in midnight blue with gold buttons — timeless Indian formal wear.",
                "349", "1200", "ethnic", "festival",
                Arrays.asList("S", "M", "L"),
                "https://images.unsplash.com/photo-1621784563330-caee0b138a00?w=600&q=80",
                true, false, true, "Shah Rukh Khan", "Pathaan", 4.7, 210),

            makeProduct("Anarkali Gown",
                "Floor-length anarkali gown with intricate zari embroidery in deep crimson.",
                "499", "1800", "ethnic", "wedding",
                Arrays.asList("XS", "S", "M", "L", "XL"),
                "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80",
                true, true, false, null, null, 4.9, 305),

            makeProduct("Linen Kurta Set",
                "Breathable off-white linen kurta-pyjama set. Perfect for casual gatherings.",
                "149", "500", "casual", "casual",
                Arrays.asList("S", "M", "L", "XL", "XXL"),
                "https://images.unsplash.com/photo-1617220650000-3e5c6e9b1a56?w=600&q=80",
                true, false, false, null, null, 4.5, 67),

            makeProduct("Velvet Blazer",
                "Rich burgundy velvet blazer with gold pocket square.",
                "299", "1000", "semi-formal", "party",
                Arrays.asList("S", "M", "L"),
                "https://images.unsplash.com/photo-1594938298603-c8148c4b4d8c?w=600&q=80",
                true, true, false, null, null, 4.4, 44),

            makeProduct("SRK Pathaan Jacket",
                "Iconic structured jacket from Pathaan as worn by Shah Rukh Khan.",
                "699", "2500", "formal", "party",
                Arrays.asList("M", "L", "XL"),
                "https://images.unsplash.com/photo-1596902852634-da8d3cc1988c?w=600&q=80",
                true, true, true, "Shah Rukh Khan", "Pathaan", 4.9, 312),

            makeProduct("Designer Lehenga Choli",
                "Stunning hand-embroidered lehenga choli in rose gold with mirror work.",
                "799", "3000", "ethnic", "wedding",
                Arrays.asList("XS", "S", "M", "L"),
                "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80",
                true, true, false, null, null, 4.8, 198),

            makeProduct("Jab Tak Hai Jaan Military Jacket",
                "Rugged military jacket as seen in Jab Tak Hai Jaan. Effortlessly casual — pure SRK.",
                "449", "1500", "casual", "casual",
                Arrays.asList("M", "L", "XL"),
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
                true, false, true, "Shah Rukh Khan", "Jab Tak Hai Jaan", 4.6, 145)
        );

        productRepository.saveAll(products);
        System.out.println("Seeded " + products.size() + " products");
    }

    private Product makeProduct(String name, String description,
                                 String pricePerDay, String deposit,
                                 String category, String occasion,
                                 List<String> sizes, String imageUrl,
                                 boolean available, boolean trending,
                                 boolean celebrity, String celebrityName, String movieName,
                                 double rating, int reviewCount) {
        Product p = new Product();
        p.setName(name);
        p.setDescription(description);
        p.setPricePerDay(new BigDecimal(pricePerDay));
        p.setSecurityDeposit(new BigDecimal(deposit));
        p.setCategory(category);
        p.setOccasion(occasion);
        p.setAvailableSizes(sizes);
        p.setImageUrl(imageUrl);
        p.setAvailable(available);
        p.setTrending(trending);
        p.setCelebrityCollection(celebrity);
        p.setCelebrityName(celebrityName);
        p.setMovieName(movieName);
        p.setRating(rating);
        p.setReviewCount(reviewCount);
        p.setTotalRentals(0);
        return p;
    }
}
