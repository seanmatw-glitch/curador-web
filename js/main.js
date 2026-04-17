/* ============================================
   CURADOR BRANDS — Main JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Hamburger Menu ──
  const hamburger = document.getElementById('hamburger');
  const menuOverlay = document.getElementById('menuOverlay');
  const menuLinks = document.querySelectorAll('.menu-overlay__link');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    document.body.style.overflow = menuOverlay.classList.contains('active') ? 'hidden' : '';
  });

  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      menuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });


  // ── Nav scroll effect ──
  const nav = document.querySelector('.nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }, { passive: true });


  // ── Scroll Reveal ──
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // ── Logo Pulse on Scroll ──
  const brandLogos = document.querySelectorAll('.brand-section__logo');

  const pulseObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('pulse');
        pulseObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3
  });

  brandLogos.forEach(logo => pulseObserver.observe(logo));


  // ── Modals ──
  const speakCards = document.querySelectorAll('.speak__card[data-modal]');
  const modals = document.querySelectorAll('.modal');

  speakCards.forEach(card => {
    card.addEventListener('click', () => {
      const modalId = `modal-${card.dataset.modal}`;
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  modals.forEach(modal => {
    const backdrop = modal.querySelector('.modal__backdrop');
    backdrop.addEventListener('click', () => closeModal(modal));
    const closeBtn = modal.querySelector('.modal__close');
    closeBtn.addEventListener('click', () => closeModal(modal));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(modal => {
        if (modal.classList.contains('active')) closeModal(modal);
      });
      if (menuOverlay.classList.contains('active')) {
        hamburger.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });

  function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }


  // ── Missouri Map — Static Image + HTML Markers ──
  placeMarkers();
});


/* ============================================
   Dispensary Marker Placement
   ============================================ */

// Map bounds: shift all dots east; STL cluster lands right at the IL border
const MAP_BOUNDS = {
  latTop: 40.93,
  latBottom: 35.81,
  lngLeft: -96.13,
  lngRight: -88.15
};

function latLngToPercent(lat, lng) {
  const x = ((lng - MAP_BOUNDS.lngLeft) / (MAP_BOUNDS.lngRight - MAP_BOUNDS.lngLeft)) * 100;
  const y = ((MAP_BOUNDS.latTop - lat) / (MAP_BOUNDS.latTop - MAP_BOUNDS.latBottom)) * 100;
  return { x, y };
}

// Real Missouri dispensary city locations with lat/lng
// Excludes: KC Cannabis x5, Cassville x1, Budds x1, Missouri Made x1, Verts x4
const DISPENSARY_CITIES = [
  // ── St. Louis Metro (dense cluster — ~15 locations) ──
  // Pushed east ~0.024 so cluster sits right against the Mississippi/IL
  // border (~-90.18) without crossing; lat restored to real values
  { lat: 38.627, lng: -90.175, size: 'lg' },   // Downtown STL (riverfront)
  { lat: 38.645, lng: -90.221, size: 'md' },   // North City
  { lat: 38.598, lng: -90.216, size: 'md' },   // South City
  { lat: 38.635, lng: -90.261, size: 'md' },   // Central West End
  { lat: 38.660, lng: -90.278, size: 'sm' },   // U City
  { lat: 38.580, lng: -90.241, size: 'sm' },   // Tower Grove
  { lat: 38.615, lng: -90.316, size: 'sm' },   // Maplewood
  { lat: 38.642, lng: -90.356, size: 'sm' },   // Olivette
  { lat: 38.668, lng: -90.311, size: 'sm' },   // Overland
  { lat: 38.592, lng: -90.326, size: 'sm' },   // Webster Groves
  { lat: 38.555, lng: -90.266, size: 'sm' },   // Lemay
  { lat: 38.695, lng: -90.271, size: 'sm' },   // Bridgeton
  { lat: 38.610, lng: -90.195, size: 'sm' },   // North STL (kept west of river)
  { lat: 38.650, lng: -90.386, size: 'sm' },   // Creve Coeur
  { lat: 38.578, lng: -90.381, size: 'sm' },   // Kirkwood
  // Chesterfield / West County
  { lat: 38.663, lng: -90.530, size: 'md' },   // Chesterfield
  { lat: 38.700, lng: -90.490, size: 'sm' },   // Maryland Heights
  // St. Charles / O'Fallon / Wentzville
  { lat: 38.784, lng: -90.497, size: 'md' },   // St. Charles
  { lat: 38.810, lng: -90.700, size: 'sm' },   // O'Fallon
  { lat: 38.812, lng: -90.855, size: 'sm' },   // Wentzville
  // Arnold / Festus / South
  { lat: 38.432, lng: -90.378, size: 'sm' },   // Arnold
  { lat: 38.221, lng: -90.397, size: 'sm' },   // Festus

  // ── Kansas City Metro (dense cluster — ~12 locations) ──
  // Shifted east +0.25 total so cluster sits clearly inside MO
  { lat: 39.099, lng: -94.328, size: 'lg' },   // Downtown KC
  { lat: 39.054, lng: -94.341, size: 'md' },   // Westport (KCMO)
  { lat: 39.060, lng: -94.330, size: 'md' },   // Midtown
  { lat: 39.130, lng: -94.305, size: 'md' },   // Northeast KC
  { lat: 39.089, lng: -94.355, size: 'sm' },   // Westside (KCMO)
  { lat: 39.050, lng: -94.270, size: 'sm' },   // Swope area
  { lat: 39.112, lng: -94.326, size: 'sm' },   // Columbus Park
  { lat: 39.035, lng: -94.205, size: 'sm' },   // Raytown
  { lat: 39.017, lng: -94.165, size: 'sm' },   // Grandview
  { lat: 39.145, lng: -94.230, size: 'sm' },   // Independence (N)
  // Independence / Blue Springs / Lee's Summit
  { lat: 39.091, lng: -94.164, size: 'md' },   // Independence
  { lat: 39.017, lng: -94.032, size: 'sm' },   // Blue Springs
  { lat: 38.911, lng: -94.132, size: 'md' },   // Lee's Summit
  { lat: 38.888, lng: -94.090, size: 'sm' },   // Lee's Summit S
  // Liberty / Gladstone
  { lat: 39.246, lng: -94.169, size: 'sm' },   // Liberty
  { lat: 39.205, lng: -94.305, size: 'sm' },   // Gladstone

  // ── Springfield (cluster — ~6 locations) ──
  { lat: 37.209, lng: -93.292, size: 'lg' },   // Downtown
  { lat: 37.230, lng: -93.320, size: 'md' },   // North
  { lat: 37.188, lng: -93.260, size: 'md' },   // East
  { lat: 37.195, lng: -93.350, size: 'sm' },   // West
  { lat: 37.170, lng: -93.290, size: 'sm' },   // South
  { lat: 37.215, lng: -93.240, size: 'sm' },

  // ── Columbia (cluster — ~4 locations) ──
  { lat: 38.952, lng: -92.334, size: 'lg' },   // Downtown
  { lat: 38.970, lng: -92.370, size: 'md' },   // North
  { lat: 38.935, lng: -92.295, size: 'sm' },   // East
  { lat: 38.940, lng: -92.380, size: 'sm' },   // West

  // ── Jefferson City ──
  { lat: 38.577, lng: -92.174, size: 'md' },
  { lat: 38.560, lng: -92.210, size: 'sm' },

  // ── Joplin (shifted east +0.25 total to stay inside MO) ──
  { lat: 37.084, lng: -94.263, size: 'md' },
  { lat: 37.060, lng: -94.230, size: 'sm' },
  { lat: 37.100, lng: -94.295, size: 'sm' },

  // ── St. Joseph (shifted east +0.25 total to stay inside MO) ──
  { lat: 39.769, lng: -94.597, size: 'md' },
  { lat: 39.750, lng: -94.570, size: 'sm' },

  // ── Cape Girardeau ──
  { lat: 37.306, lng: -89.518, size: 'md' },
  { lat: 37.290, lng: -89.540, size: 'sm' },

  // ── Branson ──
  { lat: 36.644, lng: -93.219, size: 'md' },
  { lat: 36.660, lng: -93.250, size: 'sm' },

  // ── Sedalia ──
  { lat: 38.704, lng: -93.228, size: 'sm' },

  // ── Rolla ──
  { lat: 37.951, lng: -91.771, size: 'sm' },
  { lat: 37.940, lng: -91.800, size: 'sm' },

  // ── Lake of the Ozarks ──
  { lat: 38.130, lng: -92.660, size: 'sm' },
  { lat: 38.115, lng: -92.620, size: 'sm' },

  // ── Poplar Bluff ──
  { lat: 36.757, lng: -90.393, size: 'sm' },

  // ── West Plains ──
  { lat: 36.728, lng: -91.852, size: 'sm' },

  // ── Kirksville ──
  { lat: 40.195, lng: -92.583, size: 'sm' },

  // ── Hannibal ──
  { lat: 39.708, lng: -91.358, size: 'sm' },

  // ── Warrensburg ──
  { lat: 38.763, lng: -93.736, size: 'sm' },

  // ── Lebanon ──
  { lat: 37.680, lng: -92.664, size: 'sm' },

  // ── Macon ──
  { lat: 39.742, lng: -92.473, size: 'sm' },

  // ── Farmington ──
  { lat: 37.781, lng: -90.422, size: 'sm' },

  // ── Marshall ──
  { lat: 39.123, lng: -93.197, size: 'sm' },

  // ── Nevada ──
  { lat: 37.839, lng: -94.355, size: 'sm' },

  // ── Lamar ──
  { lat: 37.495, lng: -94.277, size: 'sm' },

  // ── Sikeston ──
  { lat: 36.877, lng: -89.588, size: 'sm' },

  // ── Kennett ──
  { lat: 36.236, lng: -90.055, size: 'sm' },

  // ── Boonville ──
  { lat: 38.974, lng: -92.743, size: 'sm' },

  // ── Washington ──
  { lat: 38.558, lng: -91.012, size: 'sm' },

  // ── Fulton ──
  { lat: 38.847, lng: -91.948, size: 'sm' },

  // ── Excelsior Springs ──
  { lat: 39.339, lng: -94.226, size: 'sm' },

  // ── Belton ──
  { lat: 38.812, lng: -94.532, size: 'sm' },

  // ── Grain Valley ──
  { lat: 39.015, lng: -94.198, size: 'sm' },

  // ── Ozark ──
  { lat: 37.021, lng: -93.206, size: 'sm' },

  // ── Nixa ──
  { lat: 37.043, lng: -93.296, size: 'sm' },

  // ── Republic ──
  { lat: 37.120, lng: -93.480, size: 'sm' },

  // ── Carthage ──
  { lat: 37.176, lng: -94.310, size: 'sm' },

  // ── Neosho ──
  { lat: 36.869, lng: -94.368, size: 'sm' },

  // ── Moberly ──
  { lat: 39.418, lng: -92.438, size: 'sm' },

  // ── Mexico ──
  { lat: 39.170, lng: -91.882, size: 'sm' },

  // ── Hermann ──
  { lat: 38.704, lng: -91.440, size: 'sm' },

  // ── Perryville ──
  { lat: 37.724, lng: -89.861, size: 'sm' },

  // ── Sullivan ──
  { lat: 38.208, lng: -91.160, size: 'sm' },

  // ── Waynesville / St. Robert ──
  { lat: 37.829, lng: -92.112, size: 'sm' },

  // ── Camdenton ──
  { lat: 38.008, lng: -92.745, size: 'sm' },

  // ── Harrisonville ──
  { lat: 38.653, lng: -94.349, size: 'sm' },

  // ── Clinton ──
  { lat: 38.368, lng: -93.778, size: 'sm' },

  // ── Bolivar ──
  { lat: 37.615, lng: -93.411, size: 'sm' },

  // ── Monett ──
  { lat: 36.929, lng: -93.927, size: 'sm' },

  // ── Aurora ──
  { lat: 36.970, lng: -93.718, size: 'sm' },

  // ── Mountain Grove ──
  { lat: 37.130, lng: -92.264, size: 'sm' },

  // ── Dexter ──
  { lat: 36.796, lng: -89.958, size: 'sm' },

  // ── Chillicothe ──
  { lat: 39.795, lng: -93.553, size: 'sm' },

  // ── Trenton ──
  { lat: 40.079, lng: -93.616, size: 'sm' },

  // ── Cameron ──
  { lat: 39.740, lng: -94.241, size: 'sm' },

  // ── Savannah ──
  { lat: 39.942, lng: -94.830, size: 'sm' },

  // ── Eldon ──
  { lat: 38.350, lng: -92.582, size: 'sm' },

  // ── Osage Beach ──
  { lat: 38.153, lng: -92.638, size: 'sm' },
];

// Kansas City label only — the map image labels the other MO cities already
const CITY_LABELS = [
  { name: 'KANSAS CITY', lat: 39.099, lng: -94.328, dx: 0, dy: -38 },
];

function placeMarkers() {
  const overlay = document.getElementById('mapMarkersOverlay');
  if (!overlay) return;

  overlay.innerHTML = '';

  DISPENSARY_CITIES.forEach((d, i) => {
    const pos = latLngToPercent(d.lat, d.lng);

    // Skip markers outside the visible map area
    if (pos.x < 0 || pos.x > 100 || pos.y < 0 || pos.y > 100) return;

    const marker = document.createElement('div');
    const sizeClass = d.size === 'lg' ? 'mo-marker--lg' : d.size === 'sm' ? 'mo-marker--sm' : '';
    marker.className = `mo-marker ${sizeClass}`;
    marker.style.left = `${pos.x}%`;
    marker.style.top = `${pos.y}%`;

    const pulse = document.createElement('div');
    pulse.className = 'mo-marker__pulse';
    pulse.style.animationDelay = `${(i * 0.09) % 2.5}s`;

    const dot = document.createElement('div');
    dot.className = 'mo-marker__dot';

    marker.appendChild(pulse);
    marker.appendChild(dot);
    overlay.appendChild(marker);
  });

  CITY_LABELS.forEach(c => {
    const pos = latLngToPercent(c.lat, c.lng);
    if (pos.x < 0 || pos.x > 100 || pos.y < 0 || pos.y > 100) return;
    const label = document.createElement('div');
    label.className = 'mo-city-label';
    label.style.left = `calc(${pos.x}% + ${c.dx}px)`;
    label.style.top = `calc(${pos.y}% + ${c.dy}px)`;
    label.textContent = c.name;
    overlay.appendChild(label);
  });
}
