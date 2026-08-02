This component styles a .menu-card element representing a single menu item, using CSS custom properties for every color value (no raw hex in the card rules), a global box-sizing: border-box reset, a base font-family and line-height on body, and card-level padding, border, and a gold top accent. It also includes one pseudo-class (:hover, changing the border color) and one pseudo-element (::before, prefixing the price with "ETB "), plus a zebra-striped ingredient list using :nth-child(even).

Self-Check List
box-sizing: border-box is applied globally via \*
body has a defined font-family and line-height
.menu-card has padding, border, and a border-top gold accent
Every color in the card rules uses var(--...) — no raw hex values
.menu-card:hover changes a visual property (border color)
.menu-card**price::before inserts "ETB " before the price
.menu-card**ingredients li:nth-child(even) applies a stripe background to alternating list
