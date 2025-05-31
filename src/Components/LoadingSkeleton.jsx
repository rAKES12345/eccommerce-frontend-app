// components/LoadingSkeleton.tsx
export default function LoadingSkeleton() {
  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
      <div className="card h-100 border-0 shadow-sm rounded-4 animate-pulse">
        <div className="rounded-top-4 bg-secondary-subtle" style={{ height: "200px" }}></div>
        <div className="card-body d-flex flex-column p-3">
          <div className="bg-secondary-subtle rounded mb-2" style={{ height: "20px", width: "80%" }}></div>
          <div className="bg-secondary-subtle rounded mb-1" style={{ height: "14px", width: "60%" }}></div>
          <div className="bg-secondary-subtle rounded mb-1" style={{ height: "14px", width: "50%" }}></div>
          <div className="bg-secondary-subtle rounded mb-3" style={{ height: "14px", width: "90%" }}></div>
          <div className="mt-auto d-flex justify-content-between">
            <div className="bg-secondary-subtle rounded" style={{ height: "24px", width: "60px" }}></div>
            <div className="bg-secondary-subtle rounded" style={{ height: "28px", width: "80px" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
