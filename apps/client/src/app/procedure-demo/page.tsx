"use client";
import React, { useState, useEffect } from "react";

interface DeptNoSearchResult {
  deptNo: string;
  deptNm: string;
  strtDt: string;
  endDt: string;
  deptDivCd: string;
  deptDivNm: string;
  hqDivCd: string;
  hqDivNm: string;
  bsnDeptKb: string;
}

const apiUrl = typeof window !== "undefined" && process.env.NODE_ENV === "development"
  ? "http://localhost:8080/api/procedure/search"
  : "/api/procedure/search";

const ProcedureDemoPage = () => {
  const [form, setForm] = useState({
    deptNo: "",
    year: new Date().getFullYear().toString(),
    deptDivCd: "",
  });
  const [results, setResults] = useState<DeptNoSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deptDivCodes, setDeptDivCodes] = useState<{ code: string; name: string }[]>([]);

  useEffect(() => {
    // 부서구분코드 목록 fetch
    const fetchCodes = async () => {
      try {
        const url = typeof window !== "undefined" && process.env.NODE_ENV === "development"
          ? "http://localhost:8080/api/procedure/codes"
          : "/api/procedure/codes";
        const res = await fetch(url);
        const data = await res.json();
        console.log('부서구분코드 응답:', data); // 실제 구조 확인
        const codes = Array.isArray(data) ? data : (data.data ?? []);
        setDeptDivCodes(codes);
      } catch {
        setDeptDivCodes([]);
      }
    };
    fetchCodes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const params = new URLSearchParams({
        deptNo: form.deptNo,
        year: form.year,
        ...(form.deptDivCd ? { deptDivCd: form.deptDivCd } : {}),
      });
      const url = `${apiUrl}?${params.toString()}`;
      console.log('fetch 요청 url:', url);
      const res = await fetch(url);
      console.log('fetch 응답 status:', res.status);
      const data = await res.json();
      console.log('fetch 응답 data:', data);
      const results = Array.isArray(data) ? data : (data.data ?? []);
      console.log('setResults에 들어가는 값:', results);
      setResults(results);
    } catch (err: any) {
      console.error('handleSearch 에러:', err);
      setError(err.message || "오류 발생");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">부서번호 검색 (프로시저 DEMO)</h1>
      <section className="mb-4 flex flex-col md:flex-row gap-2 items-end">
        <div className="flex flex-col">
          <label htmlFor="deptNo" className="text-sm font-medium mb-1">부서번호(앞자리)</label>
          <input
            id="deptNo"
            name="deptNo"
            type="text"
            className="border p-2 rounded"
            placeholder="예: 1001"
            value={form.deptNo}
            onChange={handleChange}
            aria-label="부서번호"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="year" className="text-sm font-medium mb-1">기준년도</label>
          <input
            id="year"
            name="year"
            type="text"
            className="border p-2 rounded"
            placeholder="예: 2024"
            value={form.year}
            onChange={handleChange}
            aria-label="기준년도"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="deptDivCd" className="text-sm font-medium mb-1">부서구분코드(선택)</label>
          <select
            id="deptDivCd"
            name="deptDivCd"
            className="border p-2 rounded"
            value={form.deptDivCd}
            onChange={handleChange}
            aria-label="부서구분코드"
          >
            <option value="">전체</option>
            {deptDivCodes.map((item, idx) => {
              const code = item.code ?? item.CODE ?? '';
              const name = item.name ?? item.NAME ?? '';
              return (
                <option key={code || idx} value={code}>{code} - {name}</option>
              );
            })}
          </select>
        </div>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={handleSearch}
          tabIndex={0}
          aria-label="조회"
          onKeyDown={e => { if (e.key === "Enter") handleSearch(); }}
        >
          {loading ? "조회중..." : "조회"}
        </button>
      </section>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <section className="overflow-x-auto">
        <table className="w-full border mt-4 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">부서번호</th>
              <th className="border p-2">부서명</th>
              <th className="border p-2">시작일자</th>
              <th className="border p-2">종료일자</th>
              <th className="border p-2">부서구분코드</th>
              <th className="border p-2">부서구분명</th>
              <th className="border p-2">사업본부구분코드</th>
              <th className="border p-2">사업본부구분명</th>
              <th className="border p-2">구분</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 && !loading && (
              <tr><td colSpan={9} className="text-center p-4">조회 결과가 없습니다.</td></tr>
            )}
            {results.map((item, idx) => (
              <tr key={idx} className="text-center">
                <td className="border p-2">{item.deptNo ?? item.DEPT_NO}</td>
                <td className="border p-2">{item.deptNm ?? item.DEPT_NM}</td>
                <td className="border p-2">{item.strtDt ?? item.STRT_DT}</td>
                <td className="border p-2">{item.endDt ?? item.END_DT}</td>
                <td className="border p-2">{item.deptDivCd ?? item.DEPT_DIV_CD}</td>
                <td className="border p-2">{item.deptDivNm ?? item.DEPT_DIV_NM}</td>
                <td className="border p-2">{item.hqDivCd ?? item.HQ_DIV_CD}</td>
                <td className="border p-2">{item.hqDivNm ?? item.HQ_DIV_NM}</td>
                <td className="border p-2">{item.bsnDeptKb ?? item.BSN_DEPT_KB}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default ProcedureDemoPage; 