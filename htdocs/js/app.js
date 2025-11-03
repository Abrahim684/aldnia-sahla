// كود JavaScript للمنصة التعليمية
document.addEventListener('DOMContentLoaded', function() {
    // العناصر الرئيسية
    const themeToggle = document.getElementById('theme-toggle');
    const resultsContainer = document.getElementById('results-container');
    const resultsCount = document.getElementById('results-count');
    const gradeFilter = document.getElementById('grade');
    const classFilter = document.getElementById('class');
    const subjectFilter = document.getElementById('subject');
    const contentTypeFilter = document.getElementById('contentType');
    
    // قائمة المواد لكل صف
    const subjectsByClass = {
        '1': ['رياضيات', 'عربي', 'علوم-متكامله', 'انجليزي', 'تاريخ', 'فرنساوي', 'فلسفة-منطق'],
        '2': ['رياضيات', 'عربي', 'فيزياء', 'كمياء', 'انجليزي', 'تاريخ', 'فرنساوي', 'جغرافيا', 'علم-نفس-اجتماع', 'رياضيات-ادبي']
    };

    // المتغيرات العامة
    let isLoading = false;

    // ========== تحديث SEO ديناميكي ==========
    function updateSEOMeta(grade, classLevel, subject, contentType) {
        // تحديث title ديناميكيًا
        const pageTitle = `${formatSubjectName(subject)} ${getContentTypeArabic(contentType)} - الصف ${classLevel} ثانوي | منصة الدنيا سهلة`;
        document.title = pageTitle;
        
        // تحديث وصف الصفحة
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 
                `تحميل ${getContentTypeArabic(contentType)} مادة ${formatSubjectName(subject)} للصف ${classLevel} الثانوي - موارد تعليمية مجانية من منصة الدنيا سهلة`
            );
        }
        
        // تحديث Open Graph
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogTitle) ogTitle.setAttribute('content', pageTitle);
        if (ogDescription) ogDescription.setAttribute('content', 
            `${getContentTypeArabic(contentType)} ${formatSubjectName(subject)} للصف ${classLevel} الثانوي - موارد تعليمية مجانية`
        );
        
        console.log('🔄 تم تحديث بيانات SEO للمحتوى:', subject, contentType);
    }

    function getContentTypeArabic(contentType) {
        return contentType === 'ملخص' ? 'ملخصات' : 'تقييمات';
    }

    // ========== نظام تحميل الإعلانات ==========
    function loadAds() {
        // هذه الدالة يمكن تطويرها لتحميل AdSense أو أي شبكة إعلانية
        const adSection = document.getElementById('ad-section');
        if (adSection) {
            // يمكن تفعيل هذه المساحات لاحقًا
            // adSection.style.display = 'block';
            
            console.log('📢 نظام الإعلانات جاهز للتفعيل');
        }
    }

    // ========== تحديث إعلانات بناءً على المحتوى ==========
    function updateAdsBasedOnContent(subject, contentType) {
        // يمكن استخدام هذه البيانات لاستهداف إعلانات أكثر صلة
        console.log('🎯 تحميل إعلانات متعلقة بـ:', subject, contentType);
        
        // مثال: يمكن إرسال هذه البيانات لشبكة الإعلانات
        // window.google_adsense_params = {
        //     category: subject,
        //     type: contentType
        // };
    }

    // ========== نظام الوضع الليلي ==========
    function initTheme() {
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.textContent = '☀️ الوضع النهاري';
        }
        
        themeToggle.addEventListener('click', toggleTheme);
    }

    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeToggle.textContent = '☀️ الوضع النهاري';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggle.textContent = '🌙 الوضع الليلي';
        }
    }

    // ========== إعداد الفلاتر ==========
    function initFilters() {
        // تحديث قائمة المواد عند تغيير الصف
        classFilter.addEventListener('change', updateSubjects);
        
        // مراقبة جميع الفلاتر
        const filters = [gradeFilter, classFilter, subjectFilter, contentTypeFilter];
        filters.forEach(filter => {
            if (filter) {
                filter.addEventListener('change', handleFilterChange);
            }
        });
    }

    function updateSubjects() {
        const classValue = classFilter.value;
        subjectFilter.innerHTML = '<option value="">اختر المادة</option>';
        
        if (classValue && subjectsByClass[classValue]) {
            subjectsByClass[classValue].forEach(subject => {
                const option = document.createElement('option');
                option.value = subject;
                option.textContent = formatSubjectName(subject);
                subjectFilter.appendChild(option);
            });
        }
    }

    function formatSubjectName(subject) {
        const names = {
            'رياضيات': 'الرياضيات',
            'عربي': 'اللغة العربية',
            'علوم-متكامله': 'العلوم المتكاملة',
            'انجليزي': 'اللغة الإنجليزية',
            'تاريخ': 'التاريخ',
            'فرنساوي': 'اللغة الفرنسية',
            'فلسفة-منطق': 'الفلسفة والمنطق',
            'فيزياء': 'الفيزياء',
            'كمياء': 'الكيمياء',
            'جغرافيا': 'الجغرافيا',
            'علم-نفس-اجتماع': 'علم النفس والاجتماع',
            'رياضيات-ادبي': 'الرياضيات الأدبي'
        };
        return names[subject] || subject;
    }

    // ========== نظام جلب البوستات ==========
    async function fetchFilteredPosts() {
        if (isLoading) return;
        isLoading = true;
        
        try {
            showLoadingState();
            
            // الحصول على قيم الفلاتر
            const gradeValue = gradeFilter.value;
            const classValue = classFilter.value;
            const subjectValue = subjectFilter.value;
            const contentTypeValue = contentTypeFilter.value;

            // إذا لم يتم اختيار جميع الفلاتر، لا تقم بأي شيء
            if (!gradeValue || !classValue || !subjectValue || !contentTypeValue) {
                showWaitingMessage();
                return;
            }

            console.log('🔍 جلب البوستات:', {
                grade: gradeValue,
                class: classValue,
                subject: subjectValue,
                contentType: contentTypeValue
            });

            // ⭐ تحديث SEO ديناميكي
            updateSEOMeta(gradeValue, classValue, subjectValue, contentTypeValue);

            // بناء مسار الملف
            const filePath = `data/${gradeValue}/الصف-${classValue}/${subjectValue}.json`;
            
            const response = await fetch(filePath);
                    
            if (response.ok) {
                const subjectData = await response.json();
                const posts = subjectData[contentTypeValue] || [];
                
                console.log('✅ تم جلب البوستات بنجاح:', posts.length, 'بوست');
                
                if (posts.length === 0) {
                    showNoPostsMessage();
                    return;
                }
                
                // ⭐ تحديث الإعلانات بناءً على المحتوى
                updateAdsBasedOnContent(subjectValue, contentTypeValue);
                
                // معالجة وعرض البوستات
                processAndDisplayPosts(posts, subjectValue, contentTypeValue);
            } else {
                throw new Error(`ملف ${subjectValue} غير موجود`);
            }
        } catch (error) {
            console.error('❌ خطأ في جلب البيانات:', error);
            showErrorState(error);
        } finally {
            isLoading = false;
        }
    }

    // ========== معالجة البوستات ==========
    function processAndDisplayPosts(posts, subject, contentType) {
        if (!posts || posts.length === 0) {
            showNoPostsMessage();
            return;
        }

        console.log('=== معالجة البوستات ===');
        
        const processedPosts = posts.map((post, index) => {
            return {
                id: post.id || index + 1,
                title: post.title,
                description: post.description || 'لا يوجد وصف متاح',
                image: getPostImage(contentType),
                downloadLink: post.downloadLink || '#',
                categories: [
                    'ثانوي', 
                    `الصف ${classFilter.value}`, 
                    formatSubjectName(subject), 
                    contentType
                ],
                date: post.date || new Date().toISOString().split('T')[0]
            };
        });

        console.log('📊 البوستات المعالجة:', processedPosts.length);
        displayPosts(processedPosts);
    }

    function getPostImage(contentType) {
        return createContentTypeImage(contentType);
    }

    function createContentTypeImage(contentType) {
        const colorMap = {
            'تقييم': '#4361ee',
            'ملخص': '#f72585'
        };
        
        const color = colorMap[contentType] || '#4361ee';
        const icon = getContentIcon(contentType);
        
        const svgString = `
            <svg width="280" height="160" viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg">
                <rect width="280" height="160" fill="${color}" opacity="0.9"/>
                <text x="140" y="80" text-anchor="middle" dy="0.35em" font-family="Arial, sans-serif" font-size="28" fill="white" font-weight="bold">
                    ${icon}
                </text>
            </svg>
        `.trim().replace(/\s+/g, ' ');
        
        const encodedSVG = encodeURIComponent(svgString)
            .replace(/'/g, '%27')
            .replace(/"/g, '%22');
        
        return `data:image/svg+xml;utf8,${encodedSVG}`;
    }

    function getContentIcon(contentType) {
        const icons = {
            'تقييم': '📝',
            'ملخص': '📄'
        };
        return icons[contentType] || '📁';
    }

    // ========== عرض البوستات ==========
    function displayPosts(posts) {
        if (!resultsContainer) return;
        
        if (!posts || posts.length === 0) {
            showNoPostsMessage();
            return;
        }
        
        resultsCount.textContent = `${posts.length} نتيجة`;
        
        let html = '';
        posts.forEach((post) => {
            const metaHTML = post.categories.slice(0, 4).map(category => 
                `<span class="meta-tag">${category}</span>`
            ).join('');
            
            html += `
                <div class="resource-card" data-post-id="${post.id}">
                    <div style="height: 140px; background: #f0f0f0; border-radius: 8px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                        <img src="${post.image}" alt="${post.title}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy">
                    </div>
                    <h3 class="card-title">${post.title}</h3>
                    <div class="card-meta">
                        ${metaHTML}
                    </div>
                    <p class="card-description">${post.description}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                        <a href="${post.downloadLink}" class="download-btn" target="_blank" onclick="trackDownload('${post.title.replace(/'/g, "\\'")}')">
                            📥 تحميل
                        </a>
                        <span style="font-size: 0.8rem; color: #666;">${formatDate(post.date)}</span>
                    </div>
                </div>
            `;
        });
        
        resultsContainer.innerHTML = html;
    }

    // ========== إدارة الأحداث ==========
    function handleFilterChange() {
        const gradeValue = gradeFilter.value;
        const classValue = classFilter.value;
        const subjectValue = subjectFilter.value;
        const contentTypeValue = contentTypeFilter.value;

        if (gradeValue && classValue && subjectValue && contentTypeValue) {
            fetchFilteredPosts();
        } else {
            showWaitingMessage();
        }
    }

    // ========== إدارة حالات التحميل ==========
    function showLoadingState() {
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="loading">
                    <div style="font-size: 2rem; margin-bottom: 10px;">⏳</div>
                    <div>جارٍ البحث عن المحتوى التعليمي...</div>
                </div>
            `;
        }
        if (resultsCount) {
            resultsCount.textContent = 'يتم التحميل...';
        }
    }

    function showWaitingMessage() {
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <div style="font-size: 3rem; margin-bottom: 15px;">🔍</div>
                    <h3 style="margin-bottom: 15px;">اختر خيارات البحث</h3>
                    <p style="margin-bottom: 20px; line-height: 1.6;">
                        يرجى اختيار جميع خيارات التصفية (المرحلة، الصف، المادة، نوع المحتوى) لعرض النتائج.
                    </p>
                </div>
            `;
        }
        if (resultsCount) {
            resultsCount.textContent = 'انتظر اختيار الفلاتر';
        }
    }

    function showNoPostsMessage() {
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <div style="font-size: 3rem; margin-bottom: 15px;">📭</div>
                    <h3 style="margin-bottom: 15px;">لا توجد محتويات تعليمية</h3>
                    <p style="margin-bottom: 20px; line-height: 1.6;">
                        لم يتم العثور على أي محتوي مطابق للفلاتر المحددة.
                    </p>
                </div>
            `;
        }
        if (resultsCount) {
            resultsCount.textContent = '0 نتيجة';
        }
    }

    function showErrorState(error) {
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <div style="font-size: 3rem; margin-bottom: 15px;">❌</div>
                    <h3 style="margin-bottom: 15px;">خطأ في تحميل المحتوى</h3>
                    <p>${error.message}</p>
                </div>
            `;
        }
    }

    // ========== وظائف مساعدة ==========
    function formatDate(dateString) {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    }

    // ========== أداة مساعدة لإضافة محتوى ==========
    function addContentHelper() {
        window.addNewContent = function() {
            console.log(`
🎯 أداة إضافة محتوى جديد:

1. افتح ملف المادة المطلوب (مثال: data/ثانوي/الصف-1/رياضيات.json)
2. أضف هذا الكود في القسم المناسب:

{
  "id": ${Date.now()},
  "title": "عنوان المحتوى الجديد",
  "description": "وصف المحتوى الجديد",
  "downloadLink": "uploads/اسم-الملف.pdf",
  "date": "${new Date().toISOString().split('T')[0]}"
}

3. احفظ الملف وارفع ملف PDF في مجلد uploads/
4. جدد الصفحة لرؤية التغييرات
            `);
        };
    }

    // ========== تهيئة التطبيق ==========
    function initApp() {
        console.log('🚀 بدء تحميل المنصة...');
        initTheme();
        initFilters();
        loadAds(); // ⭐ تحميل نظام الإعلانات
        showWaitingMessage();
        
        // أداة مساعدة لإضافة محتوى جديد
        addContentHelper();
    }

    // بدء التطبيق
    initApp();
});

// دالة لتتبع التحميلات
function trackDownload(title) {
    console.log(`📥 تم تحميل: ${title}`);
    // يمكنك إضافة كود Google Analytics هنا
}

// التأكد من تحميل الصفحة بالكامل
window.addEventListener('load', function() {
    console.log('✅ تم تحميل منصة الدنيا سهلة بنجاح');
    document.body.style.opacity = '1';
});